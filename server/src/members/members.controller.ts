import {
  Body,
  Controller,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginMemberResponseDto } from './dtos/login.member.response.dto';
import { RegisterResponseDto } from './dtos/register.response.dto';
import { RequestPasswordlessEmailDto } from './dtos/request.passwordless-email.dto';
import { VerifyPasswordlessEmailDto } from './dtos/verify-passwordless-email.dto';
import { MembersService } from './members.service';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('/p/:projectId/requestPasswordlessEmail')
  async registerWithPasswordlessEmail(
    @Param('projectId') projectId: string,
    @Body() dto: RequestPasswordlessEmailDto,
  ): Promise<RegisterResponseDto> {
    const result = await this.membersService.requestPasswordlessEmail({
      projectId: projectId,
      email: dto.email,
    });

    if (result.ok) {
      return result.value;
    }

    switch (result.error) {
      case 'ProjectNotFound':
        throw new UnauthorizedException({
          code: 'ProjectNotFound',
          message: 'Project not found',
        });

      case 'AuthMethodNotConfigured':
        throw new UnauthorizedException({
          code: 'AuthMethodNotConfigured',
          message: 'Auth method not configured',
        });

      case 'DisabledAuthMethod':
        throw new UnauthorizedException({
          code: 'DisabledAuthMethod',
          message: 'Disabled auth method',
        });
    }
  }

  @Post('/p/:projectId/verifyPasswordlessEmail')
  async verifyPasswordlessEmail(
    @Body() dto: VerifyPasswordlessEmailDto,
    @Param('projectId') projectId: string,
  ): Promise<LoginMemberResponseDto> {
    const result = await this.membersService.verifyPasswordlessEmail({
      projectId: projectId,
      email: dto.email,
      code: dto.code,
    });

    if (result.ok) {
      return result.value;
    }

    switch (result.error) {
      case 'ProjectNotFound':
        throw new UnauthorizedException({
          code: 'ProjectNotFound',
          message: 'Project not found',
        });

      case 'CodeNotFound':
        throw new UnauthorizedException({
          code: 'VerificationCodeNotFound',
          message: 'Verification code not found',
        });

      case 'CodeExpired':
        throw new UnauthorizedException({
          code: 'VerificationCodeExpired',
          message: 'Verification code expired',
        });

      case 'MemberNotFound':
        throw new UnauthorizedException({
          code: 'MemberNotFound',
          message: 'Member not found',
        });

      case 'MemberBanned':
        throw new UnauthorizedException({
          code: 'MemberBanned',
          message: 'Member banned',
        });
    }
  }
}
