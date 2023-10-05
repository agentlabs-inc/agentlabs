import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RequireAuthMethod } from '../iam/iam.decorators';
import { UserAuthenticatedRequest } from '../iam/iam.types';
import { CreateSdkSecretDto } from './dtos/create.sdk-secret.dto';
import { CreatedSdkSecretDto } from './dtos/created.sdk-secret.dto';
import { SdkSecretsService } from './sdk-secrets.service';

@ApiTags('sdk-secrets')
@ApiBearerAuth()
@Controller('sdk-secrets')
export class SdkSecretsController {
  constructor(private readonly sdkSecretsService: SdkSecretsService) {}

  @ApiUnauthorizedResponse({
    description: 'You are not authorized to perform this action',
  })
  @RequireAuthMethod('user-token')
  @Post('/create')
  async create(
    @Req() req: UserAuthenticatedRequest,
    @Body() dto: CreateSdkSecretDto,
  ): Promise<CreatedSdkSecretDto> {
    const { user } = req;

    const result = await this.sdkSecretsService.createSecret({
      ...dto,
      creatorId: user.id,
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
          message: 'You are not a member of this project',
        });
    }
  }
}
