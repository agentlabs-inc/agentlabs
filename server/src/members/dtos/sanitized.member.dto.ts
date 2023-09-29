import { IsDate, IsString } from 'class-validator';

export class SanitizedMemberDto {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  firstName: string | null;

  @IsString()
  lastName: string | null;

  @IsDate()
  verifiedAt: Date | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
