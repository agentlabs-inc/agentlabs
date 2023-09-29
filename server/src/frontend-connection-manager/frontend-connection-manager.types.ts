import { Socket } from 'socket.io';

export interface FrontendConnection {
  socket: Socket;
  projectId: string;
  agentId: string;
  createdAt: Date;
  agentKey: string;
}

export interface RegisterFrontendConnectionPayload {
  projectId: string;
  agentId: string;
  socket: Socket;
}
