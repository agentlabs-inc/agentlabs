import { Socket } from 'socket.io';

export interface FrontendConnection {
  socket: Socket;
  projectId: string;
  agentId: string;
  createdAt: Date;
  key: string;
  memberId: string;
}

export interface RegisterFrontendConnectionPayload {
  projectId: string;
  agentId: string;
  socket: Socket;
  memberId: string;
}

export interface ComputeFrontendConnectionKeyPayload {
  projectId: string;
  agentId: string;
  memberId: string;
}
