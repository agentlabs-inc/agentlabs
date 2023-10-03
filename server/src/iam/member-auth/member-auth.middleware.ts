import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MembersService } from 'src/members/members.service';
import {
  AccessTokenPayload,
  isAccessTokenPayload,
} from '../../members/members.types';
import { AuthenticatedRequest, MemberAuthenticatedRequest } from '../iam.types';

@Injectable()
export class MemberAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(MemberAuthMiddleware.name);

  constructor(private readonly membersService: MembersService) {}

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
      const payload = await this.membersService.verifyAccessToken(token);

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

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = this.extractToken(req);

    if (!token) {
      this.logger.debug('No token found in request');
      return next();
    }

    const { isValid, payload } = await this.isTokenValid(token);

    if (!isValid) {
      this.logger.debug('Invalid token found in request');
      return next();
    }

    const member = await this.membersService.findById(payload?.sub);

    if (!member) {
      this.logger.error(
        `Member with id ${payload?.sub} not found in database. The sub does not correspond to a valid member id.`,
      );
      return next();
    }

    req.authMethod = 'member-token';
    (req as MemberAuthenticatedRequest).member = member;

    next();
  }
}
