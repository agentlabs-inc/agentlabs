import { IsBoolean } from 'class-validator';

export class RevokeSdkSecretDto {
  @IsBoolean()
  isRevoked: boolean;
}
