import { IsString } from 'class-validator';

export class GetPublicConfigDto {
  @IsString()
  hostname: string;
}
