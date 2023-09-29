import { IsString } from 'class-validator';

export class RequestPasswordlessEmailDto {
  @IsString()
  email: string;
}
