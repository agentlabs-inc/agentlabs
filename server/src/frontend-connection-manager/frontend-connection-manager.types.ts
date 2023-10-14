import { Socket } from 'socket.io';

export interface FrontendConnection {
  socket: Socket;
  projectId: string;
  createdAt: Date;
  key: string;
  memberId: string;
  host: string;
}

export interface RegisterFrontendConnectionPayload {
  projectId: string;
  socket: Socket;
  memberId: string;
  host: string;
}

export interface ComputeFrontendConnectionKeyPayload {
  projectId: string;
  memberId: string;
}
