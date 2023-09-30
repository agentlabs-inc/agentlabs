import { IsString } from 'class-validator';

export class AgentMessageDto {
  @IsString()
  text: string;

  @IsString()
  conversationId: string;
}
