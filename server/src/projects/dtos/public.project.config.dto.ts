import { IsString } from 'class-validator';

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
}
