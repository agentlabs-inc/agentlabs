import { MessageFormat } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { BaseRealtimeMessageDto } from 'src/common/base-realtime-message.dto';

class StreamChatMessageTokenDtoData {
  @IsString()
  text: string;

  @IsString()
  conversationId: string;

  @IsString()
  messageId: string;

  @IsEnum(MessageFormat)
  format: MessageFormat;
}

export class StreamChatMessageTokenDto extends BaseRealtimeMessageDto {
  @ValidateNested()
  @Type(() => StreamChatMessageTokenDtoData)
  data: StreamChatMessageTokenDtoData;
}
