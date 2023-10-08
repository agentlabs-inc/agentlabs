import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { BaseRealtimeMessageDto } from 'src/common/base-realtime-message.dto';

class StreamChatMessageTokenDtoData {
  @IsString()
  text: string;

  @IsString()
  conversationId: string;

  @IsString()
  messageId: string;
}

export class StreamChatMessageTokenDto extends BaseRealtimeMessageDto {
  @ValidateNested()
  @Type(() => StreamChatMessageTokenDtoData)
  data: StreamChatMessageTokenDtoData;
}
