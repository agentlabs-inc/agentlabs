import { IsString } from 'class-validator';
import { SanitizedUserResponseDto } from './sanitized.user.response.dto';

export class LoginUserResponseDto {
  @IsString()
  accessToken: string;

  user: SanitizedUserResponseDto;
}
