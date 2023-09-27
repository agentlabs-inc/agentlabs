import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { RegisterResponseDto } from './dtos/register.response.dto';
import { RequestPasswordlessEmailDto } from './dtos/request.passwordless-email.dto';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('/requestPasswordlessEmail')
  async registerWithPasswordlessEmail(
    @Body() dto: RequestPasswordlessEmailDto,
  ): Promise<RegisterResponseDto> {
    const result = await this.membersService.requestPasswordlessEmail(dto);

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
}
