import { get, writable } from "svelte/store";

export interface ChatMessage {
	messageId: string;
	text: string;
	source: 'USER' | 'AGENT' | 'SYSTEM';
	createdAt: string;
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

export const findMessageById = (messageId: string) => {
	return get(chatStore).messages.some(message => message.id === messageId);
}

export const addStreamedMessageToken = (message: ChatMessage) => {
	chatStore.update(store => {
		const messageToEdit = store.messages.find(m => message.messageId === m.messageId);

		if (messageToEdit) {
			console.log('adding ', message.text, ' to ', messageToEdit.text);
			store.messages = store.messages.map(m => {
				if (m.messageId === message.messageId) {
					m.text = `${m.text}${message.text}`;
				}

				return m;
			});
		} else {
			console.log('adding new message', message);
			store.messages = [...store.messages, message]
		}

		return store;
	});
}
