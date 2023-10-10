import type { Conversation } from "$lib/entities/conversation/conversation";
import { v4 as uuidv4 } from 'uuid'
import { get, writable } from "svelte/store";

export interface ConversationStore {
	list: Conversation[];
	selectedConversationId: string | null;
}

export const conversationStore = writable<ConversationStore>({
	list: [],
	selectedConversationId: null,
});


export const setConversationList = (list: Conversation[]) => {
	conversationStore.update((store) => {
		store.list = list;

		return store;
	});
};

export const setSelectedConversationId = (id: string | null) => {
	conversationStore.update((store) => {
		store.selectedConversationId = id;

		return store;
	});
}

export const getConversationById = (id: string): Conversation | undefined => {
	const { list } = get(conversationStore);

	return list.find((conversation) => conversation.id === id);
}

export const addConversation = (conversation: Conversation) => {
	conversationStore.update((store) => {
		store.list = [conversation, ...store.list];

		return store;
	});
}

export const generateConversationId = () => uuidv4();
