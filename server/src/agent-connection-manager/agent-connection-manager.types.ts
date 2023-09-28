import { Socket } from 'socket.io';

export interface AgentConnection {
  socket: Socket;
  agentId: string;
  projectId: string;
  agentKey: string;
  createdAt: Date;
}

export interface RegisterConnectionPayload {
  socket: Socket;
  agentId: string;
  projectId: string;
}
