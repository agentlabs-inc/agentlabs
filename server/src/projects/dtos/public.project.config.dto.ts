import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';

import { AuthMethodType, AuthProvider } from '@prisma/client';
import { IsIn } from 'class-validator';

const AuthMethodTypes = Object.values(AuthMethodType);
const AuthProviders = Object.values(AuthProvider);

export class PublicAuthMethodDto {
  @IsIn(AuthMethodTypes)
  type: AuthMethodType;

  @IsIn(AuthProviders)
  provider: AuthProvider;

  @IsString()
  clientId: string;

  // Deprecated, will be remove on next release
  @IsBoolean()
  isUsingDemoConfig: boolean;

  @IsBoolean()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
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
