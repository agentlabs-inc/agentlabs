import { Onboarding } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OnboardingDto {
  @IsString()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsBoolean()
  hasAddedAuthMethod: boolean;

  @IsBoolean()
  hasUsedTheApplication: boolean;

  @IsString()
  userId: string;

  @IsString()
  organizationId: string;

  @IsString()
  projectId: string | null;
}
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

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => OnboardingDto)
  onboarding: Onboarding;

  @IsNumber()
  projectCount: number;

  @IsNumber()
  projectCreatedCount: number;

  @IsNumber()
  agentCreatedCount: number;
}
