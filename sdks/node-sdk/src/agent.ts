import { AgentConfig, MessageFormat, SendMessageOptions, SendMessagePayload } from './types';
import { localMessageFormatToRemote } from './constants';
import { AgentMessageStream } from './agent-message-stream';


export class Agent {
	constructor(
		private readonly config: AgentConfig
	) {}

	send({ text, conversationId }: SendMessagePayload, options: SendMessageOptions = {}) {
		const format: MessageFormat = options.format ?? 'PlainText';

		this.config.realtime.emit('chat-message', {
			text,
			conversationId,
			format: localMessageFormatToRemote[format],
			agentId: this.config.agentId,
		});
	}

	createStream({ conversationId }: { conversationId: string }, options: SendMessageOptions = {}): AgentMessageStream {
		return new AgentMessageStream({
			conversationId,
			agentId: this.config.agentId,
			realtime: this.config.realtime,
			format: options.format
		});
	}
}
