import { RawChatMessage } from './types';

export class IncomingChatMessage {
	public readonly text: string;
	public readonly conversationId: string;
	public readonly messageId: string;
	public readonly memberId: string;

	constructor(message: RawChatMessage) {
		this.text = message.text;
		this.conversationId = message.conversationId;
		this.messageId = message.messageId;
		this.memberId = message.memberId;
	}
}
