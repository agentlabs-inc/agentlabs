import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { BaseRealtimeMessageDto } from 'src/common/base-realtime-message.dto';

class FrontendChatMessageDtoData {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  conversationId: string;
}

export class FrontendChatMessageDto extends BaseRealtimeMessageDto {
  @ValidateNested()
  @Type(() => FrontendChatMessageDtoData)
  data: FrontendChatMessageDtoData;
}
