import { AuthMethodType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

const isMethodType = (value: any[]): value is AuthMethodType[] => {
  const keys = Object.values(AuthMethodType);
  return value.some((item) => {
    return !keys.includes(item);
  });
};

export class CreateDemoAuthMethodsDto {
  @IsArray()
  @Type(() => isMethodType)
  methodTypes: AuthMethodType[];

  @IsString()
  projectId: string;
}
