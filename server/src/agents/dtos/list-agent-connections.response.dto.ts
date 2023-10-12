import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AgentConnectionDto } from './agent-connection.dto';

export class ListAgentConnectionsDto {
  @ValidateNested()
  @Type(() => AgentConnectionDto)
  items: AgentConnectionDto[];
}
