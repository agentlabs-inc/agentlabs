import { AgentChatMessagesService } from "$lib/services/gen-api"
import { loadMessages } from "$lib/stores/chat"

export const fetchMessages = async (conversationId: string) => {
	const messages = await AgentChatMessagesService.listByConversationId({ conversationId })

	loadMessages(messages)

	return messages
}
