import { IsEmail, IsString } from 'class-validator';

export class VerifyPasswordlessEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  code: string;
}
