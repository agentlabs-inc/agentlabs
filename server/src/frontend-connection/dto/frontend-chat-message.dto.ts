import { IsOptional, IsString } from 'class-validator';

export class FrontendChatMessageDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  conversationId?: string;
}
