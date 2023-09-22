import { IsArray, IsIn, IsString } from 'class-validator';

export class CreateDemoAuthMethodsDto {
  @IsArray()
  @IsIn(['PASSWORDLESS_EMAIL'], { each: true })
  methodTypes: ['PASSWORDLESS_EMAIL'];

  @IsString()
  projectId: string;
}
