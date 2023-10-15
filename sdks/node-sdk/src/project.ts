import { Agent } from "./agent";
import { RealtimeClient } from "./realtime";
import { OnChatMessageHandler, RawChatMessage } from "./types";
import { IncomingChatMessage } from "./incoming-chat-message";
import { Logger } from "./logger";

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
	}

	async connect() {
		this.clientLogger.info('Connecting to AgentLabs server...');
		return this.realtime.connect();
	}

	onChatMessage(handler: OnChatMessageHandler) {
		this.realtime.on('chat-message', (data: any) => {
			const rawChatMessage = data.data as RawChatMessage;

			handler(new IncomingChatMessage(rawChatMessage));
		});
	}

	async disconnect() {
		return this.realtime.disconnect();
	}

	agent(agentId: string): Agent {
		return new Agent({
			realtime: this.realtime,
			agentId
		});
	}
}

