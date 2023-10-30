import {
  Body,
  ConflictException,
  Controller,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserAuthenticatedRequest } from 'src/iam/iam.types';
import { RequireAuthMethod } from '../iam/iam.decorators';
import { TelemetryService } from '../telemetry/telemetry.service';
import { LoginResponseDto } from './dtos/login.response.dto';
import { LoginUserDto } from './dtos/login.user.dto';
import { oauthUserAuthorizeDto } from './dtos/oauth.authorize.dto';
import { RegisterUserDto } from './dtos/register.user.dto';
import { UserCreatedResponseDto } from './dtos/user.created.response.dto';
import { WhoAmIResultDto } from './dtos/whoami.result.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiInternalServerErrorResponse({
  description: 'Something went wrong.',
})
@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly telemetryService: TelemetryService,
  ) {}

  @ApiConflictResponse({
    description: 'User already exists, please login.',
  })
  @Post('/register')
  async register(
    @Body() dto: RegisterUserDto,
  ): Promise<UserCreatedResponseDto> {
    const result = await this.usersService.registerWithEmailAndPassword(dto);

    if (!result.ok) {
      switch (result.error) {
        case 'UserAlreadyExists':
          throw new ConflictException({
            message: 'User already exists, please login.',
            code: 'UserAlreadyExists',
          });
      }
    }

    this.telemetryService.trackConsoleUser({
      userId: result.value.id,
      event: 'User Created',
    });

    return result.value;
  }

  @ApiUnauthorizedResponse({
    description:
      'The provided credentials are invalid or the user does not have a password configured.',
  })
  @Post('/login')
  async login(@Body() dto: LoginUserDto): Promise<LoginResponseDto> {
    const result = await this.usersService.loginWithEmailAndPassword(
      dto.email,
      dto.password,
    );

    if (!result.ok) {
      switch (result.error) {
        case 'UserNotFound':
          throw new UnauthorizedException({
            message: 'User not found, please sign up',
            code: 'UserNotFound',
          });

        case 'InvalidPassword':
          throw new UnauthorizedException({
            message: 'Invalid password',
            code: 'InvalidPassword',
          });

        case 'UserDoesNotHavePassword':
          throw new UnauthorizedException({
            message: 'User does not have a password',
            code: 'UserDoesNotHavePassword',
          });

        case 'UserDoesNotHavePasswordHashConfig':
          throw new UnauthorizedException({
            message: 'User does not have a password hash config',
            code: 'UserDoesNotHavePasswordHashConfig',
          });
      }
    }

    this.telemetryService.trackConsoleUser({
      userId: result.value.user.id,
      event: 'User Logged In',
    });

    return result.value;
  }

  @Post('oauth/handleCallback/:providerId')
  async handleOAuthCallback(
    @Body() dto: oauthUserAuthorizeDto,
    @Param('providerId') providerId: string,
  ): Promise<LoginResponseDto> {
    const result = await this.usersService.completeOAuthLogin({
      code: dto.code,
      providerId,
      redirectUri: dto.redirectUri,
      state: dto.state,
    });

    if (!result.ok) {
      throw new UnauthorizedException({
        message: result.error,
        description: result.error,
      });
    }

    if (result.value.created) {
      this.telemetryService.trackConsoleUser({
        userId: result.value.user.id,
        event: 'User Created',
      });
    } else {
      this.telemetryService.trackConsoleUser({
        userId: result.value.user.id,
        event: 'User Logged In',
      });
    }

    return result.value;
  }

  @RequireAuthMethod('user-token')
  @ApiBearerAuth()
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Post('/whoami')
  async whoami(@Req() req: UserAuthenticatedRequest): Promise<WhoAmIResultDto> {
    const result = await this.usersService.getWhoAmI(req.user.id);

    if (!result.ok) {
      switch (result.error) {
        case 'UserNotFound':
          throw new UnauthorizedException({
            message: 'User not found, please sign up',
            code: 'UserNotFound',
          });
      }
    }

    this.telemetryService.identify({
      userId: result.value.id,
      traits: {
        projectCreatedCount: result.value.projectCreatedCount,
        agentCreatedCount: result.value.agentCreatedCount,
        organizationCount: result.value.organizationCount,
        hasAddedAuthMethod: result.value.onboarding.hasAddedAuthMethod,
      },
    });

    return result.value;
  }
}
