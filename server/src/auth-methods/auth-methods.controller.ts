import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuthenticatedRequest } from 'src/iam/iam.types';
import { RequireAuthMethod } from '../iam/iam.decorators';
import { TelemetryService } from '../telemetry/telemetry.service';
import { AuthMethodsService } from './auth-methods.service';
import { ListAuthMethodResponseDto } from './dtos/list.auth-method.response.dto';
import { UpsertAuthMethodDto } from './dtos/upsert.auth-method.dto';
import { UpsertedAuthMethodDto } from './dtos/upserted.auth-method.dto';

@ApiTags('authMethods')
@ApiBearerAuth()
@Controller('authMethods')
export class AuthMethodsController {
  constructor(
    private readonly authMethodsService: AuthMethodsService,
    private readonly telemetryService: TelemetryService,
  ) {}

  @RequireAuthMethod('user-token')
  @Post('/upsert')
  async upsert(
    @Req() req: UserAuthenticatedRequest,
    @Body() dto: UpsertAuthMethodDto,
  ): Promise<UpsertedAuthMethodDto> {
    const result = await this.authMethodsService.upsertAuthMethod({
      ...dto,
      userId: req.user.id,
    });

    if (result.ok) {
      this.telemetryService.track({
        event: 'AuthMethod Configured',
        userId: req.user.id,
        properties: {
          provider: dto.provider,
        },
      });
      return result.value;
    }

    switch (result.error) {
      case 'ProjectNotFound':
        throw new UnauthorizedException({
          message: 'Project not found',
          code: 'ProjectNotFound',
        });

      case 'NotAProjectUser':
        throw new UnauthorizedException({
          message: 'Not a project user',
          code: 'NotAProjectUser',
        });
    }
  }

  @RequireAuthMethod('user-token')
  @Get('/listForProject/:projectId')
  async listAuthMethods(
    @Req() req: UserAuthenticatedRequest,
    @Param('projectId') projectId: string,
  ): Promise<ListAuthMethodResponseDto> {
    const result = await this.authMethodsService.listAuthMethodsForProject({
      projectId,
      userId: req.user.id,
    });

    if (result.ok) {
      return result.value;
    }

    switch (result.error) {
      case 'ProjectNotFound':
        throw new UnauthorizedException({
          message: 'Project not found',
          code: 'ProjectNotFound',
        });

      case 'NotAProjectUser':
        throw new UnauthorizedException({
          message: 'Not a project user',
          code: 'NotAProjectUser',
        });
    }
  }
}
