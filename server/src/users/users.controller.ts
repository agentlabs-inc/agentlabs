import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUserDto } from './dtos/register.user.dto';
import { UserCreatedDto } from './responses/user.created.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiConflictResponse({
  description: 'User already exists, please login.',
})
@ApiInternalServerErrorResponse({
  description: 'Something went wrong.',
})
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() dto: RegisterUserDto): Promise<UserCreatedDto> {
    const result = await this.usersService.registerWithEmailAndPassword(dto);
    if (result.ok) {
      return result.value;
    }

    if (result.error === 'UserAlreadyExists') {
      throw new ConflictException({
        message: 'User already exists, please login.',
        code: 'UserAlreadyExists',
      });
    }

    throw new InternalServerErrorException({
      message: 'Something went wrong.',
      code: 'UnexpectedError',
    });
  }
}
