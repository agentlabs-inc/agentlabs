import { AuthProvider } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

const AuthProviders = Object.values(AuthProvider);

export class CreateAuthMethodDto {
  @IsIn(AuthProviders)
  provider: AuthProvider;

  @IsString()
  projectId: string;

  @IsBoolean()
  isEnabled: boolean;

  @IsOptional()
  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  clientSecret: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsOptional()
  scopes: string[];
}
