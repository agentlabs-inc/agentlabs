import { ChatMessagesService } from "$lib/services/gen-api"
import { loadMessages } from "$lib/stores/chat"

export const fetchMessages = async (conversationId: string) => {
	const messages = await ChatMessagesService.listByConversationId({ conversationId })

	loadMessages(messages)

	return messages
}
