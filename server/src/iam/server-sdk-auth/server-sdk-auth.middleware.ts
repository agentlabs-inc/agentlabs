import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ProjectsService } from 'src/projects/projects.service';
import {
  AuthenticatedRequest,
  ServerSdkAuthenticatedRequest,
} from '../iam.types';

export interface SdkAuthConfig {
  projectId: string;
  secret: string;
}

@Injectable()
export class ServerSdkAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ServerSdkAuthMiddleware.name);

  constructor(private readonly projectsService: ProjectsService) {}

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

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const config = this.extractSdkConfig(req);

    if (!config) {
      this.logger.debug(
        'Could not extract SDK config from request, assuming other auth method',
      );
      return next();
    }

    const isSdkSecretValid = await this.projectsService.verifySdkSecret(
      config.projectId,
      config.secret,
    );

    if (!isSdkSecretValid) {
      this.logger.error('Invalid SDK secret for this project.');
      return next();
    }

    req.authMethod = 'server-sdk';
    (req as ServerSdkAuthenticatedRequest).sdkUser = {
      projectId: config.projectId,
    };
    next();
  }
}
