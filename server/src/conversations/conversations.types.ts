export interface CreateConversationPayload {
  id: string;
  projectId: string;
  memberId: string;
}

export interface FindAllConversationsPayload {
  projectId: string;
  memberId: string;
}
