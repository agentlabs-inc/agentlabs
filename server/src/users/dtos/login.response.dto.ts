import { SanitizedUserResponseDto } from './sanitized.user.response.dto';

export class LoginResponseDto {
  accessToken: string;
  user: SanitizedUserResponseDto;
}
