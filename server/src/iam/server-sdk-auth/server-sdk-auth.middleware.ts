import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../iam.types';

export interface SdkAuthConfig {
  projectId: string;
  secret: string;
}

@Injectable()
export class ServerSdkAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ServerSdkAuthMiddleware.name);

  private extractSdkConfig(req: Request): SdkAuthConfig | null {
    const projectId = req.header('x-agentlabs-project-id');
    const secret = req.header('x-agentlabs-sdk-secret');

    if (!projectId || !secret) {
      return null;
    }

    return {
      projectId,
      secret,
    };
  }

  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const config = this.extractSdkConfig(req);

    if (!config) {
      this.logger.debug(
        'Could not extract SDK config from request, assuming other auth method',
      );
      return next();
    }

    // TODO: implement SDK credentials verification

    req.authMethod = 'server-sdk';
  }
}
