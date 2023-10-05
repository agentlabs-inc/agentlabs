import { IsString } from 'class-validator';

export class GetAllConversationsDto {
  @IsString()
  readonly agentId: string;
}
