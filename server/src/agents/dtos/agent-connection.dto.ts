import { IsString } from 'class-validator';

export class AgentConnectionDto {
  @IsString()
  ip: string;

  @IsString()
  sid: string;

  @IsString()
  createdAt: string;
}
