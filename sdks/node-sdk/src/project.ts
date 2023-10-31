import { Agent } from "./agent";
import { RealtimeClient } from "./realtime";
import { OnChatMessageHandler, RawChatMessage } from "./types";
import { IncomingChatMessage } from "./incoming-chat-message";
import { Logger } from "./logger";
import { HttpApi } from "./http";
import { MessageFormat, SendMessageOptions, SendMessagePayload } from "./types"
import { localMessageFormatToRemote } from "./constants";

export interface ProjectConfig {
	url: string;
	projectId: string;
	secret: string;
}


class System {
	constructor(private readonly realtime: RealtimeClient) {}

	send(
		{ text, conversationId }: Omit<SendMessagePayload, 'attachments'>,
        options: SendMessageOptions = {}
	) {
		const format: MessageFormat = options.format ?? 'PlainText';

        this.realtime.emit('chat-message', {
            text,
            conversationId,
            format: localMessageFormatToRemote[format],
			attachments: [],
			source: 'SYSTEM',
			type: 'TEXT',
        });
	}
}

export class Project {
	private readonly realtime: RealtimeClient;
	private readonly isDebugEnabled: boolean = false;
	private clientLogger = new Logger({
		name: 'Client',
	})
	private serverLogger = new Logger({
		name: 'Server',
	})
	private readonly http: HttpApi;
	public readonly system: System;

	constructor(
	 	config: ProjectConfig,
	) {
		this.isDebugEnabled = !!process.env.DEBUG;
		this.realtime = new RealtimeClient(config);
		this.realtime.on('message', (data) => {
			if (typeof data.message === 'string') {
				this.serverLogger.info(data.message);
			}
		})
		this.realtime.on('heartbeat', (_, ack) => {
			if (this.isDebugEnabled) {
				this.clientLogger.debug('Server heartbeat acknowledged');
			}

			ack({
				ok: true,
			});
		})
		this.http = new HttpApi(config);
		this.system = new System(this.realtime);
	}

	async connect() {
		this.clientLogger.info('Connecting to AgentLabs server...');
		return this.realtime.connect();
	}

	onChatMessage(handler: OnChatMessageHandler) {
		this.realtime.on('chat-message', async (data: any) => {
			const rawChatMessage = data.data as RawChatMessage;
			const message = new IncomingChatMessage(this.http, rawChatMessage);

			try {
				await handler(message);
			} catch (err: any) {
				this.clientLogger.error('onChatMessage: got uncaught exception while running handler. Consider handling errors in your handler directly.');
				this.system.send({
					conversationId: message.conversationId,
					text: 'An error occured while processing your request. Please try again.'
				})
			}
		});
	}

	async disconnect() {
		return this.realtime.disconnect();
	}

	agent(agentId: string): Agent {
		return new Agent({
			realtime: this.realtime,
			http: this.http,
			agentId
		});
	}
}

