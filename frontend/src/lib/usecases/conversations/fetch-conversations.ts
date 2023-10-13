import type { Conversation } from "$lib/entities/conversation/conversation";
import { ConversationsService } from "$lib/services/gen-api";
import { setConversationList } from "$lib/stores/conversation";

export const fetchConversations = async (projectId: string): Promise<Conversation[]> => {
	const conversations = await ConversationsService.getAllConversations({
		projectId
	});

	setConversationList(conversations);

	return conversations;
};
