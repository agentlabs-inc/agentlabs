import {
  Body,
  ConflictException,
  Controller,
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
import { RequireAuthMethod } from '../iam/iam.decorators';
import { LocalAuthenticatedRequest } from '../iam/iam.types';
import { LoginResponseDto } from './dtos/login.response.dto';
import { LoginUserDto } from './dtos/login.user.dto';
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
  constructor(private readonly usersService: UsersService) {}

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

    return result.value;
  }

  @RequireAuthMethod('local')
  @ApiBearerAuth()
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Post('/whoami')
  async whoami(
    @Req() req: LocalAuthenticatedRequest,
  ): Promise<WhoAmIResultDto> {
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

    return result.value;
  }
}
