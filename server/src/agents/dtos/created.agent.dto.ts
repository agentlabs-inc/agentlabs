import { IsDate, IsString } from 'class-validator';

export class CreatedAgentDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  projectId: string;

  @IsString()
  creatorId: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
