import { derived, writable } from "svelte/store";

export const ChatMessageFormats = ["PLAIN_TEXT", "MARKDOWN"] as const;

export type ChatMessageFormat = (typeof ChatMessageFormats)[number];

export type ChatMessageSource = "USER" | "AGENT" | "SYSTEM";
export type ChatMessageType = "CONVERSATION_MESSAGE" | "LOGIN_REQUEST";

export interface ChatMessage {
	id: string;
	text: string;
	source: ChatMessageSource;
	createdAt: string;
	format: ChatMessageFormat;
	agentId?: string;
	type: ChatMessageType;
}

export interface ChatStore {
	messages: ChatMessage[];
	activeStreams: string[];
}

export const chatStore = writable(<ChatStore>{
	messages: [],
	activeStreams: []
});

export const isStreaming = derived(chatStore, ($chatStore) => $chatStore.activeStreams.length > 0);

export const loadMessages = (messages: ChatMessage[]) => {
	chatStore.update((store) => {
		store.messages = messages;
		return store;
	});
};

export const addMessage = (message: ChatMessage) => {
	chatStore.update((store) => {
		store.messages.push(message);
		return store;
	});
};

export const addStreamedMessageToken = (message: ChatMessage) => {
	chatStore.update((store) => {
		const index = store.messages.findIndex((m) => message.id === m.id);

		if (index != -1) {
			store.messages[index] = {
				...store.messages[index],
				text: `${store.messages[index].text}${message.text}`
			};
		} else {
			store.messages = [...store.messages, message];
		}

		return store;
	});
};

export const addActiveStream = (streamId: string) => {
	chatStore.update((store) => {
		const hasStream = store.activeStreams.includes(streamId);

		if (!hasStream) {
			store.activeStreams = [...store.activeStreams, streamId];
		}

		return store;
	});
};

export const removeActiveStream = (streamId: string) => {
	chatStore.update((store) => {
		store.activeStreams = store.activeStreams.filter((s) => s !== streamId);

		return store;
	});
};
