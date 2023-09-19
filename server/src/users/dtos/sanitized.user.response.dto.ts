import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class SanitizedUserResponseDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsBoolean()
  isVerified: boolean;

  @IsString()
  lookupId: string;

  @IsBoolean()
  hasPassword: boolean;
}
