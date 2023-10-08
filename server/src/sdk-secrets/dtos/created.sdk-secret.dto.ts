import { IsString } from 'class-validator';
import { SanitizedSdkSecretDto } from './sanitized.sdk-secret.dto';

export class CreatedSdkSecretDto extends SanitizedSdkSecretDto {
  @IsString()
  clearValue: string;
}
