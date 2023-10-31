import { ChatMessageSource, MessageFormat } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  MessageType,
  MessageTypes,
} from 'src/chat-messages/chat-messages.types';
import { BaseRealtimeMessageDto } from 'src/common/base-realtime-message.dto';

class AttachmentDto {
  @IsString()
  id: string;
}

class AgentMessageDataDto {
  @IsString()
  text: string;

  @IsString()
  conversationId: string;

  @IsString()
  messageId: string;

  @IsString()
  @IsOptional()
  agentId?: string;

  @IsEnum(MessageFormat)
  format: MessageFormat;

  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments: AttachmentDto[];

  @IsIn(['AGENT', 'SYSTEM'] satisfies ChatMessageSource[])
  source: 'AGENT' | 'SYSTEM';

  @IsIn(MessageTypes)
  type: MessageType;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class AgentMessageDto extends BaseRealtimeMessageDto {
  @ValidateNested()
  @Type(() => AgentMessageDataDto)
  data: AgentMessageDataDto;
}
