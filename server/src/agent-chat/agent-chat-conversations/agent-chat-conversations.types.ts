export interface CreateAgentChatConversationPayload {
  id: string;
  agentId: string;
  memberId: string;
}

export interface FindAllConversationsPayload {
  agentId: string;
  memberId: string;
}
