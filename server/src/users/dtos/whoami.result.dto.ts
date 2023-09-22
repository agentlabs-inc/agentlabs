import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

export class WhoAmIResultDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsDate()
  verifiedAt: Date | null;

  @IsNumber()
  organizationCount: number;

  @IsString()
  defaultProjectId: string | null;

  @IsString()
  defaultOrganizationId: string | null;

  @IsNumber()
  projectCount: number;

  @IsNumber()
  projectCreatedCount: number;
}
