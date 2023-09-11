/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 * */
exports.up = (pgm) => {
	pgm.db.query(`
		CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

		CREATE TABLE IF NOT EXISTS users(
			id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
			username VARCHAR(255) NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			sign_in_method VARCHAR(30) NOT NULL DEFAULT 'email-password'
		);
		CREATE TABLE IF NOT EXISTS conversations(
			id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			agent_id VARCHAR(255) NOT NULL,
			user_id uuid NOT NULL REFERENCES users(id)
		);
		CREATE TABLE IF NOT EXISTS tasks (
			id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
			content TEXT NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			conversation_id uuid NOT NULL REFERENCES conversations(id)
		);
		CREATE TABLE IF NOT EXISTS messages (
			id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
			content TEXT NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			task_id uuid NOT NULL REFERENCES tasks(id),
			type VARCHAR(30) NOT NULL
		);
	`);
};

exports.down = pgm => {
	pgm.db.query(`
		DROP TABLE IF EXISTS messages;
		DROP TABLE IF EXISTS tasks;
		DROP TABLE IF EXISTS conversations;
		DROP TABLE IF EXISTS users;
	`);
};
