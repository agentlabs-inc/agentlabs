import { MessageFormat } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { BaseRealtimeMessageDto } from 'src/common/base-realtime-message.dto';

class AgentMessageDataDto {
  @IsString()
  text: string;

  @IsString()
  conversationId: string;

  @IsString()
  messageId: string;

  @IsEnum(MessageFormat)
  format: MessageFormat;
}

export class AgentMessageDto extends BaseRealtimeMessageDto {
  @ValidateNested()
  @Type(() => AgentMessageDataDto)
  data: AgentMessageDataDto;
}
