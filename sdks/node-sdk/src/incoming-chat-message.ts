import { MessageAttachment } from './message-attachment';
import { Member, RawChatMessage } from './types';
import { HttpApi } from './http';

export class IncomingChatMessage {
	public readonly text: string;
	public readonly conversationId: string;
	public readonly messageId: string;
	public readonly memberId: string;
	public readonly member: Member;
	public readonly attachments: MessageAttachment[];

	constructor(http: HttpApi, message: RawChatMessage) {
		this.text = message.text;
		this.conversationId = message.conversationId;
		this.messageId = message.messageId;
		this.memberId = message.member.id;
		this.member = message.member;
		this.attachments = (message.attachments ?? []).map((a) => new MessageAttachment(http, a));
	}
}
