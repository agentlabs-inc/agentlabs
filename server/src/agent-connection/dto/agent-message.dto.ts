import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { BaseRealtimeMessageDto } from 'src/common/base-realtime-message.dto';

class AgentMessageDataDto {
  @IsString()
  text: string;

  @IsString()
  conversationId: string;
}

export class AgentMessageDto extends BaseRealtimeMessageDto {
  @ValidateNested()
  @Type(() => AgentMessageDataDto)
  data: AgentMessageDataDto;
}
