import { Server, Socket } from "socket.io";

export interface DeclareAgentPayload {
	id: string;
	name: string;
	logoUrl?: string;
}

export interface Agent {
	socket: Socket;
	info: DeclareAgentPayload;
}

export interface AddTaskPayload {
	agentId: string;
	task: {
		id: string;
		text: string;
	}
}

export interface TaskOnChainStart {
	task: {
		id: string;
	}
	runId: string;
}

const io = new Server({
	cors: {
		origin: "*",
	}
});
const port = Number(process.env.PORT || '3000')

const clients = new Set<Socket>();
const agents = new Map<string, Agent>();
const agentSubscribers = new Map<string, Socket[]>();

const taskIdToClient = new Map<string, Socket>();

const emitReadyAgentsToAllClients = () => {
	const agentsInfo = [...agents.values()].map(({ info }) => info);

		for (const client of clients) {
			client.emit('agents/list', agentsInfo);
		}
}

const emitReadyAgentsToClient = (client: Socket) => {
	const agentsInfo = [...agents.values()].map(({ info }) => info);

	client.emit('agents/list', agentsInfo);
}


io.on("connect_error", (err) => {
	console.log(`connect_error due to ${err.message}`);
});

io.on("connection", async (socket) => {
	 const userAgent = socket.handshake.headers['user-agent'];

	 if (userAgent === 'agentlabs-agent') { 
		 socket.on('agents/declare', (payload: DeclareAgentPayload) => {
			 console.log('agent connected', payload.id, socket.id)
			agents.set(payload.id, {
				socket,
				info: payload,	
			});

			emitReadyAgentsToAllClients();

			const emitToTaskSubscriber = (taskId: string, eventName: string, payload: any) => {
				const client = taskIdToClient.get(taskId);

				if (client) {
					client.emit(eventName, payload);
				} else {
					console.error(`Client for task ${taskId} not found`);
				}
			}

			socket.on('agents/tasks/llm_start', (payload: any) => {
				console.log('agents/tasks/on_llm_start', payload)
				emitToTaskSubscriber(payload.task.id, 'agents/tasks/llm_start', payload)
			})

			socket.on('agents/tasks/llm_end', (payload: any) => {
				console.log('agents/tasks/on_llm_end', payload)
				emitToTaskSubscriber(payload.task.id, 'agents/tasks/llm_end', payload)
			})

			socket.on('agents/tasks/llm_error', (payload: any) => {
				console.log('agents/tasks/on_llm_error', payload)
				emitToTaskSubscriber(payload.task.id, 'agents/tasks/llm_error', payload)
			})

			socket.on('agents/tasks/tool_start', (payload: any) => {
				console.log('agents/tasks/on_tool_start', payload)
				emitToTaskSubscriber(payload.task.id, 'agents/tasks/tool_start', payload)
			})

			socket.on('agents/tasks/tool_end', (payload: any) => {
				console.log('agents/tasks/on_tool_end', payload)
				emitToTaskSubscriber(payload.task.id, 'agents/tasks/tool_end', payload)
			})

			socket.on('agents/tasks/tool_error', (payload: any) => {
				console.log('agents/tasks/on_tool_error', payload)
				emitToTaskSubscriber(payload.task.id, 'agents/tasks/tool_error', payload)
			})

			 socket.on('agents/tasks/chain_start', (payload: any) => {
				console.log('agents/tasks/on_chain_start', payload)
				emitToTaskSubscriber(payload.task.id, 'agents/tasks/chain_start', payload)
			 })

			 socket.on('agents/tasks/chain_end', (payload: any) => {
				 console.log('agents/tasks/on_chain_end', payload)
				 emitToTaskSubscriber(payload.task.id, 'agents/tasks/chain_end', payload)
			 })

			 socket.on('agents/tasks/chain_error', (payload: any) => {
				 console.log('agents/tasks/on_chain_error', payload)
			 })

			 socket.on('agents/tasks/error', (payload: any) => {
				 console.log('agents/tasks/on_error', payload)
				 emitToTaskSubscriber(payload.task.id, 'agents/tasks/error', payload)
			})


			socket.on('disconnect', () => {
				console.log('agent disconnected', socket.id)
				agents.delete(payload.id);
				emitReadyAgentsToAllClients();
			});
		 })
	 } else {
		 console.log('client connected')
		 clients.add(socket);

		 emitReadyAgentsToClient(socket);

		 socket.on('agents/add-task', (payload: AddTaskPayload) => {
			 const agent = agents.get(payload.agentId);
			 
			 if (!agent) {
				 console.error(`Agent with id ${payload.agentId} not found, but task was sent to it`)

				 return ;
			 }

			 taskIdToClient.set(payload.task.id, socket);

			 if (agent) {
				 console.log('task added to ', agent.socket.id)
			 	agent.socket.emit('task_added', payload.task, (response: unknown, error: unknown) => {
					console.log('task_added response', response, error)
				});

							 }
		 })

		 socket.on('disconnect', () => {
			 console.log('client disconnected')
			clients.delete(socket);
			const tasks = [...taskIdToClient.entries()].filter(([, client]) => client === socket);

			for (const [taskId] of tasks) {
				taskIdToClient.delete(taskId);
			}
		 });
	 }


	/*
	socket.on('chain_start', (data) => {
		console.log(JSON.stringify(data, null, 2));
	});

	socket.on('chain_end', (data) => {
		console.log(JSON.stringify(data, null, 2));
	});
	*/
});

io.listen(port);

console.log(`Server listening on port ${port}`);
