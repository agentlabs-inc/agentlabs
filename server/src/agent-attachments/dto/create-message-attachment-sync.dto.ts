import { IsString } from 'class-validator';

export class CreateMessageAttachmentSyncDto {
  @IsString()
  projectId: string;

  @IsString()
  agentId: string;

  @IsString()
  messageId: string;
}
