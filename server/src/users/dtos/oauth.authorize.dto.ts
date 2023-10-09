import { IsString } from 'class-validator';

export class oauthUserAuthorizeDto {
  @IsString()
  code: string;

  @IsString()
  state: string;

  @IsString()
  redirectUri: string;
}
