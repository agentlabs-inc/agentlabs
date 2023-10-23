import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedQueryDto } from '../common/paginated.query.dto';
import { RequireAuthMethod } from '../iam/iam.decorators';
import { UserAuthenticatedRequest } from '../iam/iam.types';
import { ListMembersResponseDto } from './dtos/list.members.response.dto';
import { LoginMemberResponseDto } from './dtos/login.member.response.dto';
import { oauthAuthorizeDto } from './dtos/oauth.authorize.dto';
import { RegisterResponseDto } from './dtos/register.response.dto';
import { RequestPasswordlessEmailDto } from './dtos/request.passwordless-email.dto';
import { VerifyPasswordlessEmailDto } from './dtos/verify-passwordless-email.dto';
import { MembersService } from './members.service';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @RequireAuthMethod('user-token')
  @Get('/p/:projectId/listMembers')
  async listMembers(
    @Param('projectId') projectId: string,
    @Query() query: PaginatedQueryDto,
    @Req() req: UserAuthenticatedRequest,
  ): Promise<ListMembersResponseDto> {
    const result = await this.membersService.listMembers({
      userId: req.user.id,
      projectId,
      limit: query.limit,
      page: query.page,
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

      case 'NotAProjectUser':
        throw new UnauthorizedException({
          code: 'NotAProjectUser',
          message: 'Not a project user',
        });
    }
  }

  @Post('/p/:projectId/signInAnonymously')
  async signInAnonymously(
    @Param('projectId') projectId: string,
  ): Promise<LoginMemberResponseDto> {
    const result = await this.membersService.signInAnonymously(projectId);

    if (result.ok) {
      return result.value;
    }

    switch (result.error) {
      case 'ProjectNotFound':
        throw new UnauthorizedException({
          code: 'ProjectNotFound',
          message: 'Project not found',
        });
    }
  }

  @Post('/p/:projectId/requestPasswordlessEmail')
  async requestPasswordlessEmail(
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

  @Post('oauth/handleCallback/:providerId')
  async handleOAuthCallback(
    @Body() dto: oauthAuthorizeDto,
    @Param('providerId') providerId: string,
  ): Promise<LoginMemberResponseDto> {
    const result = await this.membersService.completeOAuthLogin({
      code: dto.code,
      providerId,
      redirectUri: dto.redirectUri,
      state: dto.state,
      projectId: dto.projectId,
    });

    if (!result.ok) {
      throw new UnauthorizedException({
        message: result.error,
        description: result.error,
      });
    }

    return result.value;
  }
}
