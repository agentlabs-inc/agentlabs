import { writable } from "svelte/store";

export const ChatMessageFormats = [
	'PLAIN_TEXT',
	'MARKDOWN',
] as const;

export type ChatMessageFormat = typeof ChatMessageFormats[number];

export interface ChatMessage {
	id: string;
	text: string;
	source: 'USER' | 'AGENT' | 'SYSTEM';
	createdAt: string;
	format: ChatMessageFormat;
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

export const addStreamedMessageToken = (message: ChatMessage) => {
	chatStore.update(store => {
		const index = store.messages.findIndex(m => message.id === m.id);

		if (index != -1) {
			store.messages[index] = {
				...store.messages[index],
				text: `${store.messages[index].text}${message.text}`
			}
		} else {
			store.messages = [...store.messages, message]
		}

		return store;
	});
}
