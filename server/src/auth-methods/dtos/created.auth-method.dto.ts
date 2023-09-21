import { AuthMethodType, IdentityProvider } from '@prisma/client';
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
const IdentityProviders = Object.values(IdentityProvider);

export class CreatedAuthMethodDto {
  @IsIn(AuthMethodTypes)
  type: AuthMethodType;

  @IsIn(IdentityProviders)
  provider: IdentityProvider;

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
