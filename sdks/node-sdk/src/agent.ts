import { AgentMessageStream } from './agent-message-stream';
import { localMessageFormatToRemote } from './constants';
import {
    AgentConfig,
    MessageFormat,
    SendMessageOptions,
    SendMessagePayload,
    TypewriteMessageOptions,
} from './types';

export class Agent {
    constructor(private readonly config: AgentConfig) {}

    send(
        { text, conversationId }: SendMessagePayload,
        options: SendMessageOptions = {}
    ) {
        const format: MessageFormat = options.format ?? 'PlainText';

        this.config.realtime.emit('chat-message', {
            text,
            conversationId,
            format: localMessageFormatToRemote[format],
            agentId: this.config.agentId,
        });
    }

    async typewrite(
        { text, conversationId }: SendMessagePayload,
        options: TypewriteMessageOptions = {
            delay: 70,
            initialDelay: 1500,
        }
    ) {
        const initialDelay = options.initialDelay ?? 0;
        const delay = options.delay ?? 70;

        const stream = this.createStream({ conversationId }, options);

        if (initialDelay !== 0) {
            await new Promise((resolve) =>
                setTimeout(resolve, options.initialDelay)
            );
        }

        const splits = text.split('');
        for (let i = 0; i < splits.length; i++) {
            stream.write(splits[i]);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }

        stream.end();
    }

    createStream(
        { conversationId }: { conversationId: string },
        options: SendMessageOptions = {}
    ): AgentMessageStream {
        return new AgentMessageStream({
            conversationId,
            agentId: this.config.agentId,
            realtime: this.config.realtime,
            format: options.format,
        });
    }
}
