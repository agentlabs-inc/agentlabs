import { Socket } from 'socket.io';

export interface AgentConnection {
  socket: Socket;
  projectId: string;
  key: string;
  createdAt: Date;
  ip: string;
}

export interface RegisterAgentConnectionPayload {
  socket: Socket;
  projectId: string;
  ip: string;
}
