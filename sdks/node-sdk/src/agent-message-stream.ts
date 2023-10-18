import { randomUUID } from 'crypto';
import {
    DEFAULT_MESSAGE_TYPING_INTERVAL_MS,
    DEFAULT_STREAM_TOKEN_SIZE,
} from './const';
import { localMessageFormatToRemote } from './constants';
import { RealtimeClient } from './realtime';
import { AgentMessageStreamConfig, MessageFormat } from './types';
import { chunk } from './utils/chunk';

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

    /**
     * Write the next part of the message with a typewriter animation.
     * Writing to the stream after calling `end` will throw an error.
     */
    async typewrite(message: string, options: { intervalMs?: number } = {}) {
        const interval =
            options?.intervalMs ?? DEFAULT_MESSAGE_TYPING_INTERVAL_MS;

        const chunks = chunk(message, DEFAULT_STREAM_TOKEN_SIZE);
        for (let i = 0; i < chunks.length; i++) {
            this.write(chunks[i]);
            if (interval) {
                await new Promise((resolve) => setTimeout(resolve, interval));
            }
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
