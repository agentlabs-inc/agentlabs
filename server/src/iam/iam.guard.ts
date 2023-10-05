import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_AUTH_METHOD_METADATA_KEY } from './iam.decorators';
import { AuthMethod, AuthenticatedRequest } from './iam.types';

@Injectable()
export class IamGuard implements CanActivate {
  private readonly logger = new Logger(IamGuard.name);

  constructor(private readonly reflector: Reflector) {}

  private readonly getRequiredAuthMethod = (
    context: ExecutionContext,
  ): AuthMethod[] | undefined => {
    const method = this.reflector.get<AuthMethod[] | undefined>(
      REQUIRE_AUTH_METHOD_METADATA_KEY,
      context.getHandler(),
    );

    if (method) {
      return method;
    }

    const classMethod = this.reflector.get<AuthMethod[] | undefined>(
      REQUIRE_AUTH_METHOD_METADATA_KEY,
      context.getClass(),
    );

    return classMethod;
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const requiredAuthMethod = this.getRequiredAuthMethod(context);

    if (!requiredAuthMethod) {
      this.logger.debug('No auth required, allowing access.');

      return true;
    }

    if (!req.authMethod) {
      this.logger.warn(
        `User is not authenticated, but attempted to access a resource that requires ${requiredAuthMethod} auth method.`,
      );
      throw new UnauthorizedException('Unauthenticated, please login.');
    }

    if (!requiredAuthMethod.includes(req.authMethod)) {
      this.logger.warn(
        `User attempted to use ${req.authMethod} auth method to access a resource that requires ${requiredAuthMethod}.`,
      );
      throw new ForbiddenException(
        'You are not authorized to perform this action.',
      );
    }

    return true;
  }
}
