import { Socket, io } from "socket.io-client";
import type { AgentInfo } from "./agents.types";
import { env } from '$env/dynamic/public'

export interface OnChainStartPayload {
	task: {
		id: string;
	},
	data: {
		run_id: string;
		parent_run_id: string;
		name: string;
	}
}

export interface OnChainEndPayload {
	task: {
		id: string;
	},
	data: {
		run_id: string;
		parent_run_id: string;
		name: string;
	}
}

export interface OnLlmStartPayload {
	data: {
		prompts: string[];
	}
	task: {
		id: string;
	}
}

export interface OnLlmEndPayload {
	data: {
		text: string;
	}
	task: {
		id: string;
	}
}

export interface OnToolStartPayload {
	data: {
		tool_input: string;
		tool_name: string;
	}
	task: {
		id: string;
	}
}

export interface OnToolEndPayload {
	data: {
		tool_output: string;
	}
	task: {
		id: string;
	}
}

export interface OnTaskErrorPayload {
	data: {
		error: string;
	}
	task: {

		id: string;
	},
}

class AgentsService {
	private socket: Socket;

	constructor() {
		this.socket = io((env as Record<string, string>).PUBLIC_SERVER_URL, {
			extraHeaders: {
			}
		});
		this.socket.connect();
	}

	public onAgentListChange(cb: (agents: AgentInfo[]) => void): void {
		this.socket.on("agents/list", cb);
	}

	public addTask(agentId: string, text: string): void {
		const taskId = crypto.randomUUID();

		this.socket.emit("agents/add-task", {
			agentId,
			task: {
				id: taskId,
				text
			}
		});
	}

	public onChainStart(cb: (payload: OnChainStartPayload) => void) {
		console.log("onChainStart");
		this.socket.on("agents/tasks/chain_start", cb);
	}

	public onChainEnd(cb: (payload: OnChainEndPayload) => void) {
		this.socket.on("agents/tasks/chain_end", cb);
	}

	public onLlmStart(cb: (payload: OnLlmStartPayload) => void) {
		this.socket.on("agents/tasks/llm_start", cb);
	}

	public onLlmEnd(cb: (payload: OnLlmEndPayload) => void) {
		this.socket.on("agents/tasks/llm_end", cb);
	}

	public onLlmError(cb: (payload: OnChainEndPayload) => void) {
		this.socket.on("agents/tasks/llm_error", cb);
	}

	public onToolStart(cb: (payload: OnToolStartPayload) => void) {
		this.socket.on("agents/tasks/tool_start", cb);
	}

	public onToolEnd(cb: (payload: OnToolEndPayload) => void) {
		this.socket.on("agents/tasks/tool_end", cb);
	}

	public onToolError(cb: (payload: OnChainEndPayload) => void) {
		this.socket.on("agents/tasks/tool_error", cb);
	}

	public onTaskError(cb: (payload: OnTaskErrorPayload) => void) {
		this.socket.on("agents/tasks/error", cb);
	}
}

export const agentsService = new AgentsService();
