import { IsDate, IsString } from 'class-validator';

export class SanitizedSdkSecretDto {
  @IsString()
  id: string;

  @IsString()
  description: string | null;

  @IsString()
  projectId: string;

  @IsString()
  preview: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
