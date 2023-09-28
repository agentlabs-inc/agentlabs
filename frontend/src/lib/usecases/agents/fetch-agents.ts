import type { Agent } from "$lib/entities/agent/agent";
import { setAvailableAgents } from "$lib/stores/agent";

export const fetchAgents = async (): Promise<Agent[]> => {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	// TODO: implement a real service here
	const agents = [
		{
			id: "1",
			name: "Sam",
			createdAt: new Date(),
			updatedAt: new Date()
		}
		// {
		// 	id: "2",
		// 	name: "Louis",
		// 	createdAt: new Date(),
		// 	updatedAt: new Date()
		// }
	];

	setAvailableAgents(agents);

	return Promise.resolve(agents);
};
