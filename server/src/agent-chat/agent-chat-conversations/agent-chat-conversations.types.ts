export interface CreateAgentChatConversationPayload {
  id: string;
  projectId: string;
  memberId: string;
}

export interface FindAllConversationsPayload {
  projectId: string;
  memberId: string;
}
