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

export type OnChatMessageHandler = (message: IncomingChatMessage) => void;

class StreamedMessage {
	private readonly messageId = randomUUID()

	constructor(private readonly io: Socket, private readonly conversationId: string) {
	}

	write(message: string) {
		this.io.emit('stream-chat-message-token', {
			timestamp: new Date().toISOString(),
			data: {
				text: message,
				attachments: [],
				conversationId: this.conversationId,
				messageId: this.messageId,
			}
		})
	}

	end() {
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

	streamedReply() {
		return new StreamedMessage(this.io, this.conversationId);
	}

	reply(message: string) {
		this.io.emit('chat-message', {
			timestamp: new Date().toISOString(),
			data: {
				text: message,
				attachments: [],
				conversationId: this.conversationId,
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
