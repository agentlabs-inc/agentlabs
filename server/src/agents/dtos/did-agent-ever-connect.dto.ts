import { IsBoolean } from 'class-validator';

export class DidAgentEverConnectResponse {
  @IsBoolean()
  didEverConnect: boolean;
}
