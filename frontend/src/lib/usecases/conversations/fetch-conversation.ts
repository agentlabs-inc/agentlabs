import { AgentChatConversationsService } from "$lib/services/gen-api"

export const fetchConversation = async (conversationId: string) => {
	const conversationWithMessages = await AgentChatConversationsService.getConversationById({ conversationId })

	return conversationWithMessages
}
