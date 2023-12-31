import { AuthMethodType, AuthProvider } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

const AuthMethodTypes = Object.values(AuthMethodType);
const AuthProviders = Object.values(AuthProvider);

export class UpsertAuthMethodDto {
  @IsIn(AuthProviders)
  provider: AuthProvider;

  @IsString()
  projectId: string;

  @IsBoolean()
  isEnabled: boolean;

  @IsString()
  clientId: string;

  @IsString()
  clientSecret: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsOptional()
  scopes: string[];
}
