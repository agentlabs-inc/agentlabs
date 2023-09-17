import { IsEmail, IsString } from 'class-validator';

export class SanitizedUserResponse {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
