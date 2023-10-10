import { Writable } from 'stream';
import { AgentLogger } from './logger';
import { ProjectConfig } from './project';
import io, { Socket } from 'socket.io-client';
import { randomUUID } from 'crypto';

export interface RawChatMessage {
	text: string;
	conversationId: string;
	messageId: string;
	agentId: string;
	memberId: string;
}

export interface ReplyMessageOptions {
	format?: MessageFormat;
}

const MessageFormats = [
	'PLAIN_TEXT',
	'MARKDOWN',
] as const;

export type MessageFormat = typeof MessageFormats[number];

export type OnChatMessageHandler = (message: IncomingChatMessage) => void;

class StreamedMessage {
	private readonly messageId = randomUUID()
	private isEnded = false;
	private format: MessageFormat;

	constructor(private readonly io: Socket, private readonly conversationId: string, options: ReplyMessageOptions) {
		this.format = options.format ?? 'PLAIN_TEXT';
	}

	/**
	 * Write the next part of the message.
	 * Writing to the stream after calling `end` will throw an error.
	 */
	write(message: string) {
		if (this.isEnded) {
			throw new Error('Cannot write to a stream after calling end');
		}

		this.io.emit('stream-chat-message-token', {
			timestamp: new Date().toISOString(),
			data: {
				text: message,
				attachments: [],
				conversationId: this.conversationId,
				messageId: this.messageId,
				format: this.format
			}
		})
	}

	/**
	 * Indicate that the message is complete, releasing the user's prompt.
	 * This MUST be called after all the calls to `write` have been made.
	 * Writing to the stream after calling `end` will throw an error.
	 */
	end() {
		this.isEnded = true;
		this.io.emit('stream-chat-message-end', {
			data: {
				conversationId: this.conversationId,
				messageId: this.messageId,
			}
		})
	}
}

class IncomingChatMessage {
	public readonly text: string;
	public readonly conversationId: string;
	public readonly messageId: string;
	public readonly memberId: string;

	constructor(private readonly io: Socket, rawChatMessage: RawChatMessage) {
		this.text = rawChatMessage.text;
		this.conversationId = rawChatMessage.conversationId;
		this.messageId = rawChatMessage.messageId;
		this.memberId = rawChatMessage.memberId;
	}

	/**
	 * Get a stream that can be used to reply to the message in parts.
	 * Handy for handling LLM outputs.
	 * You should not use a streamed reply if you plan it to take a long time to complete.
	 * Such reply is intended to be read by the user in realtime.
	 * If you are looking to send the entire message at once, use `reply` instead.
	 */
	streamedReply(options: ReplyMessageOptions = {}) {
		return new StreamedMessage(this.io, this.conversationId, options);
	}

	/**
	 * Reply to the message, sending the entire message at once.
	 * If you are looking to stream the reply as multiple parts, use `streamedReply` instead.
	 */
	reply(message: string, options: ReplyMessageOptions = {}) {
		const format = options.format ?? 'PLAIN_TEXT';

		this.io.emit('chat-message', {
			timestamp: new Date().toISOString(),
			data: {
				text: message,
				attachments: [],
				conversationId: this.conversationId,
				format
			}
		});
	}
}

export class Agent {
	private readonly io: Socket;
	private isConnected = false;
	private clientLogger = new AgentLogger({
		name: 'Client',
		agent_id: this.agentId
	})
	private serverLogger = new AgentLogger({
		name: 'Server',
		agent_id: this.agentId
	})

	constructor(
		private readonly projectConfig: ProjectConfig,
		private readonly agentId: string
	) {
		const namespace = 'agent';
		const url = `${projectConfig.agentlabsUrl}/${namespace}`;

		this.io = io(url, {
			extraHeaders: {
				'x-agentlabs-project-id': projectConfig.projectId,
				'x-agentlabs-agent-id': agentId,
				'x-agentlabs-sdk-secret': projectConfig.secret,
				'user-agent': 'agentlabs-node-sdk'
			},
			autoConnect: false
		});
		this.io.on('message', (data) => {
			if (typeof data.message === 'string') {
				this.serverLogger.info(data.message);
			}
		})
	}

	onChatMessage(handler: OnChatMessageHandler) {
		this.io.on('chat-message', (data: any) => {
			if (!data) {
				this.clientLogger.error('Received invalid chat message');
				return ;
			}

			const rawChatMessage = data.data as RawChatMessage;

			handler(new IncomingChatMessage(this.io, rawChatMessage));
		});
	}

	async connect() {
		this.clientLogger.info('Connecting to AgentLabs...');
		this.io.connect()

		return new Promise<void>((resolve, reject) => {
			this.io.on('connect', () => {
				this.clientLogger.info('Connected to AgentLabs');
				this.isConnected = true;
				resolve();
			});

			this.io.on('connect_error', (err: any) => {
				this.clientLogger.error('Failed to connect to AgentLabs');
				reject(err);
			});
		});
	}

	terminate() {
		this.clientLogger.info('Terminating connection to AgentLabs...');
		this.io.disconnect()
	}
}
