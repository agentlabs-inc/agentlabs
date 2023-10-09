import { IsDate, IsEmail, IsString } from 'class-validator';

export class SanitizedUserResponseDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsString()
  profilePictureUrl: string | null;

  @IsDate()
  verifiedAt: Date | null;
}
