import { IsOptional, IsString } from 'class-validator';

export class CreateSdkSecretDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  projectId: string;
}
