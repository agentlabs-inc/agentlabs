import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthenticatedRequest } from '../iam.types';

@Injectable()
export class LocalAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LocalAuthMiddleware.name);

  constructor(private readonly usersService: UsersService) {}

  private extractToken(req: Request): string | null {
    console.error(
      'Missing extractToken implementation. Returning a null token.',
    );

    return null;
  }

  private isTokenValid(token: string): boolean {
    // verification logic, would be wise to make it a proper service as part of the iam module
    return true;
  }

  // TODO: use relevant typings
  private decodeToken(token: string): any {
    return {
      user: {
        id: 1,
        lookupId: '1234567890',
      },
    };
  }

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = this.extractToken(req);

    if (!token) {
      this.logger.debug('No token found in request');
      return next();
    }

    if (!this.isTokenValid(token)) {
      this.logger.warn('Invalid token found in request');
      return next();
    }

    const { user: decodedUser } = this.decodeToken(token);
    const user = await this.usersService.deserializeUser(decodedUser.id);

    if (!user) {
      this.logger.error(
        `User with id ${decodedUser.id} and lookupId ${decodedUser.lookupId} not found in database. Either the id does not refer to a valid user or the lookup id changed.`,
      );
      return next();
    }

    req.user = user;
    req.authMethod = 'local';

    next();
  }
}
