import { IsDate, IsEmail, IsString } from 'class-validator';

export class SanitizedUserResponseDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsDate()
  verifiedAt: Date | null;
}
