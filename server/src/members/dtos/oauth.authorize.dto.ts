import { IsString } from 'class-validator';

export class oauthAuthorizeDto {
  @IsString()
  code: string;

  @IsString()
  state: string;

  @IsString()
  redirectUri: string;

  @IsString()
  projectId: string;
}
