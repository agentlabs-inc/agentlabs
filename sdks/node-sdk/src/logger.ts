export interface AgentLoggerConfig {
	name: string;
}

export const LogLevels = [
	'error',
	'warn',
	'info',
	'debug',
] as const;

export type LogLevel = typeof LogLevels[number];

export class Logger {
	constructor(private readonly config: AgentLoggerConfig) {
	}

	private generateTimestamp() {
		const now = new Date();
		const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
		const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
		const timestamp = `${date} ${time}`;

		return timestamp;
	}

	private log(level: LogLevel, ...messages: string[]) {
		const ts = this.generateTimestamp()
		const message = messages.join(' ');
		const logFn = console[level] || console.log;

		logFn(`[${this.config.name}] [${ts}] ${level} ${message}`);
	}

	error(...messages: string[]) {
		this.log('error', ...messages);
	}

	warn(...messages: string[]) {
		this.log('warn', ...messages);
	}

	info(...messages: string[]) {
		this.log('info', ...messages);
	}

	debug(...messages: string[]) {
		this.log('debug', ...messages);
	}
}
