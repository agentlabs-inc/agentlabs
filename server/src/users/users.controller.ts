import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dtos/register.user.dto';
import { SanitizedUserResponse } from './responses/sanitized.user.dto';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('/users')
export class UsersController {
  @Post('/registerUser')
  async register(@Body() dto: RegisterUserDto): Promise<SanitizedUserResponse> {
    return {
      id: '123',
      email: dto.email,
      name: dto.name,
    };
  }
}
