import { IsString } from 'class-validator';
import { SanitizedMemberDto } from './sanitized.member.dto';

export class LoginMemberResponseDto {
  @IsString()
  accessToken: string;

  member: SanitizedMemberDto;
}
