import { IsBoolean } from 'class-validator';

export class CreatedDemoAuthMethodsDto {
  @IsBoolean()
  success: boolean;
}
