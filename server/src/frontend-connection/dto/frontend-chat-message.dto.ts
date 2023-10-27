import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { BaseRealtimeMessageDto } from 'src/common/base-realtime-message.dto';

class AttachmentDto {
  @IsString()
  id: string;
}

class FrontendChatMessageDtoData {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  conversationId: string;

  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments: AttachmentDto[];
}

export class FrontendChatMessageDto extends BaseRealtimeMessageDto {
  @ValidateNested()
  @Type(() => FrontendChatMessageDtoData)
  data: FrontendChatMessageDtoData;
}
