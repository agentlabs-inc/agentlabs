import { Agent } from "./agent";
import { RealtimeClient } from "./realtime";
import { OnChatMessageHandler, RawChatMessage } from "./types";
import { IncomingChatMessage } from "./incoming-chat-message";
import { Logger } from "./logger";
import { HttpApi } from "./http";

export interface ProjectConfig {
	url: string;
	projectId: string;
	secret: string;
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
	}

	async connect() {
		this.clientLogger.info('Connecting to AgentLabs server...');
		return this.realtime.connect();
	}

	onChatMessage(handler: OnChatMessageHandler) {
		this.realtime.on('chat-message', async (data: any) => {
			const rawChatMessage = data.data as RawChatMessage;

			try {
				await handler(new IncomingChatMessage(this.http, rawChatMessage));
			} catch (err: any) {
				this.clientLogger.error('onChatMessage: got uncaught exception while running handler. Consider handling errors in your handler directly.');
				console.error(err);
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

