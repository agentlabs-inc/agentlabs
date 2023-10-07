import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

import { AuthMethodType, AuthProvider } from '@prisma/client';
import { IsIn, IsOptional } from 'class-validator';

const AuthMethodTypes = Object.values(AuthMethodType);
const AuthProviders = Object.values(AuthProvider);

export class PublicAuthMethodDto {
  @IsIn(AuthMethodTypes)
  type: AuthMethodType;

  @IsIn(AuthProviders)
  provider: AuthProvider;

  @IsOptional()
  @IsString()
  clientId: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsOptional()
  scopes: string[];
}

export class PublicProjectConfigDto {
  @IsString()
  hostname: string;

  @IsString()
  id: string;

  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsString()
  organizationId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PublicAuthMethodDto)
  authMethods: PublicAuthMethodDto[];
}
