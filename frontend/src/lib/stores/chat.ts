import { writable } from "svelte/store";

export interface ChatMessage {
	text: string;
	source: 'USER' | 'AGENT' | 'SYSTEM';
}

export interface ChatStore {
	messages: ChatMessage[];
}

export const chatStore = writable(<ChatStore>({
	messages: []
}));

export const loadMessages = (messages: ChatMessage[]) => {
	chatStore.update(store => {
		store.messages = messages;
		return store;
	});
}

export const addMessage = (message: ChatMessage) => {
	chatStore.update(store => {
		store.messages.push(message);
		return store;
	});
}
