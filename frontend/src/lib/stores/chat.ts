import type { ConversationMessage } from "$lib/entities/message/message";
import { writable } from "svelte/store";

export interface ChatStore {
	messages: ConversationMessage[];
}

export const chatStore = writable(<ChatStore>({
	messages: []
}));

export const loadMessages = (messages: ConversationMessage[]) => {
	chatStore.update(store => {
		store.messages = messages;
		return store;
	});
}

export const addMessage = (message: ConversationMessage) => {
	chatStore.update(store => {
		store.messages.push(message);
		return store;
	});
}
