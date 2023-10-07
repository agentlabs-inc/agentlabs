import { Agent } from "./agent";

export interface ProjectConfig {
	agentlabsUrl: string;
	projectId: string;
	secret: string;
}

export class Project {
	constructor(
		private readonly config: ProjectConfig,
	) {}

	agent(agentId: string): Agent {
		return new Agent(this.config, agentId);
	}
}

