import { MessageFormat } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';
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
  agentId: string;

  @IsEnum(MessageFormat)
  format: MessageFormat;

  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments: AttachmentDto[];
}

export class AgentMessageDto extends BaseRealtimeMessageDto {
  @ValidateNested()
  @Type(() => AgentMessageDataDto)
  data: AgentMessageDataDto;
}
