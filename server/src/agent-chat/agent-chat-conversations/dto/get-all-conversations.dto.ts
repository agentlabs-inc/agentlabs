import { IsString } from 'class-validator';

export class GetAllConversationsDto {
  @IsString()
  readonly projectId: string;
}
