import { IsDate, IsString } from 'class-validator';

export class SanitizedMemberDto {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  fullName: string | null;

  @IsString()
  firstName: string | null;

  @IsString()
  lastName: string | null;

  @IsString()
  profilePictureUrl: string | null;

  @IsDate()
  verifiedAt: Date | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
