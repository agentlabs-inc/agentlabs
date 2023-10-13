import type { ConversationMessage } from "../message/message";

export interface Conversation {
	id: string;
	createdAt: string;
	updatedAt: string;

	projectId: string;
	memberId: string;
}

export interface ConversationWithMessages extends Conversation {
	messages: ConversationMessage[];
}
