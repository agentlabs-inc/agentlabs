import { Injectable } from '@nestjs/common';
import { MessageFormat } from '@prisma/client';
import { Socket } from 'socket.io';
import { seconds } from 'src/common/ms-time';
import { FrontendConnectionManagerService } from 'src/frontend-connection-manager/frontend-connection-manager.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConversationMutexManager } from '../conversation-mutex-manager';

export interface StreamData {
  buffer: string;
  frontend: Socket;
  conversationId: string;
  messageId: string;
  createdAtTs: number;
  format: MessageFormat;
}

interface HandlePayload {
  messageId: string;
  conversationId: string;
  token: string;
  format: MessageFormat;
}

@Injectable()
export class AgentStreamManagerService {
  private readonly activeStreams = new Map<string, StreamData>();
  private readonly messageMutex = new ConversationMutexManager();

  constructor(
    private readonly prisma: PrismaService,
    private readonly frontendConnectionManagerService: FrontendConnectionManagerService,
  ) {
    setInterval(() => this.flushAllToDatabase(), seconds(5));
    setInterval(() => this.cleanup(), seconds(30));
  }

  private cleanup() {
    for (const [messageId] of this.activeStreams) {
      const stream = this.activeStreams.get(messageId);

      if (!stream) {
        continue;
      }

      if (
        stream.buffer === '' &&
        Date.now() - stream.createdAtTs > seconds(30)
      ) {
        this.activeStreams.delete(messageId);
      }
    }
  }

  private async flushAllToDatabase() {
    for (const [messageId] of this.activeStreams) {
      console.log('flushing to database', messageId);
      await this.flushToDatabase(messageId);
    }
  }

  private async flushToDatabase(messageId: string) {
    const stream = this.activeStreams.get(messageId);

    if (!stream) {
      return;
    }

    if (stream.buffer.length === 0) {
      const hasExpired = Date.now() - stream.createdAtTs > seconds(30);

      if (hasExpired) {
        this.activeStreams.delete(messageId);
      }

      return;
    }

    const message = await this.prisma.agentMessage.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      await this.prisma.agentMessage.create({
        data: {
          id: messageId,
          text: stream.buffer,
          source: 'AGENT',
          conversationId: stream.conversationId,
          format: stream.format,
        },
      });
    } else {
      await this.prisma.agentMessage.update({
        where: {
          id: messageId,
        },
        data: {
          text: message.text + stream.buffer,
        },
      });
    }

    stream.buffer = '';
  }

  async handle(data: HandlePayload) {
    try {
      await this.messageMutex.acquire(data.messageId);
      let stream = this.activeStreams.get(data.messageId) ?? null;

      if (!stream) {
        const conversation = await this.prisma.conversation.findUnique({
          where: {
            id: data.conversationId,
          },
          include: {
            // TODO: no more agent, previously: agent: true
          },
        });

        if (!conversation) {
          throw new Error(`Conversation not found: ID=${data.conversationId}`);
        }

        const frontend = this.frontendConnectionManagerService.getConnection({
          agentId: '', // TODO: no more agentId, previously: conversation.agent.id,
          memberId: conversation.memberId,
          projectId: conversation.projectId,
        });

        const agentId = ''; // TODO: no more agent id

        if (!frontend) {
          throw new Error(
            `Frontend connection not found: MEMBER_ID=${conversation.memberId},PROJECT_ID=${conversation.projectId},AGENT_ID=${agentId}`,
          );
        }

        frontend.socket.on('disconnect', async () => {
          await this.flushToDatabase(data.messageId);
        });

        stream = {
          frontend: frontend.socket,
          conversationId: conversation.id,
          buffer: '',
          messageId: data.messageId,
          createdAtTs: Date.now(),
          format: data.format,
        };

        this.activeStreams.set(data.messageId, stream);
      }

      stream.buffer += data.token;
      stream.frontend.emit('stream-chat-message-token', {
        data: {
          text: data.token,
          conversationId: stream.conversationId,
          messageId: stream.messageId,
          format: stream.format,
        },
      });
    } finally {
      await this.messageMutex.release(data.messageId);
    }
  }

  async end(messageId: string) {
    try {
      await this.messageMutex.acquire(messageId);
      const stream = this.activeStreams.get(messageId);

      if (!stream) {
        return;
      }

      stream.frontend.emit('stream-chat-message-end', {
        data: {
          conversationId: stream.conversationId,
          messageId: stream.messageId,
        },
      });

      await this.flushToDatabase(messageId);
      this.activeStreams.delete(messageId);
    } finally {
      this.messageMutex.release(messageId);
    }
  }
}
