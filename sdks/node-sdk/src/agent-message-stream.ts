import { randomUUID } from 'crypto';
import { localMessageFormatToRemote } from './constants';
import { RealtimeClient } from './realtime';
import { AgentMessageStreamConfig, MessageFormat } from './types';

export class AgentMessageStream {
    private readonly messageId = randomUUID();
    private isEnded = false;
    private readonly format: MessageFormat;
    private readonly conversationId: string;
    private readonly agentId: string;
    private readonly realtime: RealtimeClient;

    constructor(config: AgentMessageStreamConfig) {
        this.format = config.format ?? 'PlainText';
        this.conversationId = config.conversationId;
        this.agentId = config.agentId;
        this.realtime = config.realtime;

        this.start();
    }

    start() {
        this.realtime.emit('stream-chat-message-start', {
            conversationId: this.conversationId,
            messageId: this.messageId,
            format: localMessageFormatToRemote[this.format],
            agentId: this.agentId,
        });
    }

    async typewrite(message: string, options: { delay?: number } = {}) {
        const delay = options.delay ?? 100;

        for (let i = 0; i < message.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            this.write(message[i]);
        }
        this.end();
    }

    /**
     * Write the next part of the message.
     * Writing to the stream after calling `end` will throw an error.
     */
    write(message: string) {
        if (this.isEnded) {
            throw new Error('Cannot write to a stream after calling end');
        }

        this.realtime.emit('stream-chat-message-token', {
            text: message,
            conversationId: this.conversationId,
            messageId: this.messageId,
            format: localMessageFormatToRemote[this.format],
            agentId: this.agentId,
        });
    }

    /**
     * Indicate that the message is complete, releasing the user's prompt.
     * This MUST be called after all the calls to `write` have been made.
     * Writing to the stream after calling `end` will throw an error.
     */
    end() {
        this.isEnded = true;
        this.realtime.emit('stream-chat-message-end', {
            conversationId: this.conversationId,
            messageId: this.messageId,
            agentId: this.agentId,
        });
    }
}
