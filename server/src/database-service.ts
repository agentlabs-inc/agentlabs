import { Client as PgClient } from 'pg';
import { envService } from './env-service';

export interface DatabaseConfig {
	host: string;
	port: number;
	database: string;
	user: string;
	password: string;
}

class DatabaseService {
	private readonly client: PgClient;

	constructor(config: DatabaseConfig) {
		this.client = new PgClient(config);
		this.client.connect()
		.then(() => console.log('Connected to database'))
		.catch((err) => { throw err; });
	}

	get db(): PgClient {
		return this.client;
	}
}

const host = envService.getOrThrow('POSTGRES_HOST');
const port = Number(envService.getOrThrow('POSTGRES_PORT')) || 5432;
const database = envService.getOrThrow('POSTGRES_DB');
const user = envService.getOrThrow('POSTGRES_USER');
const password = envService.getOrThrow('POSTGRES_PASSWORD');

export const databaseService = new DatabaseService({
	host,
	port,
	database,
	user,
	password,
});
