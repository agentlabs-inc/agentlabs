export interface AgentLoggerConfig {
	agent_id: string;
	name: string;
}

export const LogLevels = [
	'error',
	'warn',
	'info',
	'debug',
] as const;

export type LogLevel = typeof LogLevels[number];

export class AgentLogger {
	constructor(private readonly config: AgentLoggerConfig) {
	}

	private generateTimestamp() {
		const now = new Date();
		const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
		const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
		const timestamp = `${date} ${time}`;

		return timestamp;
	}

	private log(level: LogLevel, message: string) {
		const ts = this.generateTimestamp()

		console.log(`[${this.config.agent_id}] [${this.config.name}] [${ts}] ${level} ${message}`);
	}

	error(message: string) {
		this.log('error', message);
	}

	warn(message: string) {
		this.log('warn', message);
	}

	info(message: string) {
		this.log('info', message);
	}

	debug(message: string) {
		this.log('debug', message);
	}
}
