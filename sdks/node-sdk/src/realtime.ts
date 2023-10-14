import { Socket, io } from "socket.io-client";
import { ProjectConfig } from "./project";

export class RealtimeClient {
	private readonly io: Socket;
	private readonly namespace = 'agent';
	private isConnected = false;

	constructor(config: ProjectConfig) {
		const url = `${config.url}/${this.namespace}`;

		this.io = io(url, {
			extraHeaders: {
				'x-agentlabs-project-id': config.projectId,
				'x-agentlabs-sdk-secret': config.secret,
				'user-agent': 'agentlabs-node-sdk'
			},
			autoConnect: false
		});
	}

	async connect() {
		if (this.isConnected) {
			throw new Error('Already connected');
		}

		this.isConnected = false;
		this.io.connect()

		return new Promise<void>((resolve, reject) => {
			this.io.on('connect_error', (err: any) => {
				reject(err);
			});
			this.io.on('connect', () => {
				this.isConnected = true;
				resolve();
			});
		});
	}

	on(event: string, callback: (...args: any[]) => void) {
		this.io.on(event, callback);
	}
	
	 emit(event: string, data: any) {
		const timestamp = Date.now();

		this.io.emit(event, {
			timestamp,
			data
		});
	}

	disconnect() {
		if (!this.isConnected) {
			throw new Error('Not connected.');
		}

		this.io.disconnect()
	}
}
