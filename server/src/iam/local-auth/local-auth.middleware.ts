import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import {
  AccessTokenPayload,
  isAccessTokenPayload,
} from '../../users/users.types';
import { AuthenticatedRequest } from '../iam.types';

@Injectable()
export class LocalAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LocalAuthMiddleware.name);

  constructor(private readonly usersService: UsersService) {}

  private extractToken(req: Request): string | null {
    return req.header('authorization')?.replace('Bearer ', '') ?? null;
  }

  private async isTokenValid(token: string): Promise<
    | {
        isValid: true;
        payload: AccessTokenPayload;
      }
    | { isValid: false; payload: null }
  > {
    try {
      const payload = await this.usersService.verifyAccessToken(token);

      if (isAccessTokenPayload(payload)) {
        return {
          isValid: true,
          payload,
        };
      }

      return {
        isValid: false,
        payload: null,
      };
    } catch (e) {
      console.error('Invalid token', e);
      return {
        isValid: false,
        payload: null,
      };
    }
  }

  // TODO: use relevant typings
  private decodeToken(token: string): any {
    token;
  }

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = this.extractToken(req);

    if (!token) {
      this.logger.debug('No token found in request');
      return next();
    }

    const { isValid, payload } = await this.isTokenValid(token);

    if (!isValid) {
      this.logger.warn('Invalid token found in request');
      return next();
    }

    const user = await this.usersService.deserializeUser(payload.sub);

    if (!user) {
      this.logger.error(
        `User with id ${payload?.sub} not found in database. The sub does not correspond to a valid user id.`,
      );
      return next();
    }

    req.user = user;
    req.authMethod = 'local';

    next();
  }
}
