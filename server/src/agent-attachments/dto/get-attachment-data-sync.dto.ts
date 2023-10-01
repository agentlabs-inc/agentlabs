import { IsString } from 'class-validator';

export class GetAttachmentDataSyncDto {
  @IsString()
  projectId: string;

  @IsString()
  agentId: string;

  @IsString()
  messageId: string;
}
