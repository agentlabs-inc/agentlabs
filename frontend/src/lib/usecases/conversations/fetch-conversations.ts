import type { Conversation } from "$lib/entities/conversation/conversation";
import { AgentChatConversationsService } from "$lib/services/gen-api";
import { setConversationList } from "$lib/stores/conversation";


export const fetchConversations = async (agentId: string, memberId: string): Promise<Conversation[]> => {
	const conversations = await AgentChatConversationsService.getAllConversations({
		memberId,
		agentId
	})

	setConversationList(conversations);

	return conversations;
}
