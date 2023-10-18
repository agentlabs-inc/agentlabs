import { IncomingChatMessage } from './incoming-chat-message';
import { RealtimeClient } from './realtime';

export interface AgentConfig {
    realtime: RealtimeClient;
    agentId: string;
}

export interface RawChatMessage {
    text: string;
    conversationId: string;
    messageId: string;
    agentId: string;
    memberId: string;
}

export interface SendMessageOptions {
    format?: MessageFormat;
}

export type TypewriteMessageOptions = {
    format?: MessageFormat;
    delay?: number;
    initialDelay?: number;
};

const MessageFormats = ['PlainText', 'Markdown'] as const;

export type MessageFormat = (typeof MessageFormats)[number];

export type OnChatMessageHandler = (message: IncomingChatMessage) => void;

export type SendMessagePayload = {
    text: string;
    conversationId: string;
};

export interface AgentMessageStreamConfig {
    realtime: RealtimeClient;
    conversationId: string;
    agentId: string;
    format?: MessageFormat;
}
