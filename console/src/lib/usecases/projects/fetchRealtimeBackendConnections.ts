import { ProjectsService, type SerializedProjectBackendConnectionDto } from "$lib/services/gen-api"

export const fetchRealtimeConnections = async (projectId: string): Promise<SerializedProjectBackendConnectionDto[]> => {
	const { items } = await ProjectsService.getRealtimeConnections({ projectId })

	return items
}
