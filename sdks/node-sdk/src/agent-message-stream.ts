import { randomUUID } from "crypto";
import { AgentMessageStreamConfig, MessageFormat } from "./types";
import { RealtimeClient } from "./realtime";
import { localMessageFormatToRemote } from "./constants";

export class AgentMessageStream {
	private readonly messageId = randomUUID()
	private isEnded = false;
	private readonly format: MessageFormat;
	private readonly conversationId: string;
	private readonly agentId: string;
	private readonly realtime: RealtimeClient;

	constructor(config: AgentMessageStreamConfig) {
		this.format =  config.format ?? 'PlainText';
		this.conversationId = config.conversationId;
		this.agentId = config.agentId;
		this.realtime = config.realtime;
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
		})
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
		})
	}
}
