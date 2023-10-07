import { AuthMethodType, AuthProvider } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

const AuthMethodTypes = Object.values(AuthMethodType);
const AuthProviders = Object.values(AuthProvider);

export class AuthMethodItemDto {
  @IsIn(AuthMethodTypes)
  type: AuthMethodType;

  @IsIn(AuthProviders)
  provider: AuthProvider;

  @IsString()
  projectId: string;

  @IsBoolean()
  isEnabled: boolean;

  @IsOptional()
  @IsString()
  clientId: string | null;

  @IsOptional()
  @IsString()
  clientSecret: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsOptional()
  scopes: string[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
