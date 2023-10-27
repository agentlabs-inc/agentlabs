export type Message = {
	id: string;
	text: string;
	createdAt: Date;
	senderFullName: string;
	senderId: string;
	from: "user" | "agent";
};

export const AgentMessageSources = [
	'USER',
	'AGENT',
	'SYSTEM'
]

export type AgentMessageSource  = typeof AgentMessageSources[number]

export interface MessageAttachmentWrapper {
	attachment: MessageAttachment;
}

export interface MessageAttachment {
		id: string;
		createdAt: string;
		updatedAt: string;
		name: string;
		mimeType: string;
		sizeBytes: number;
}

export interface ConversationMessage {
	id: string;
	createdAt: string;
	updateAt: string;

	source: AgentMessageSource;
	text: string;

	conversationId: string;

	attachments: MessageAttachmentWrapper[];
}
