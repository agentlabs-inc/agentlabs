import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PResult, err, ok } from '../common/result';
import { PrismaService } from '../prisma/prisma.service';
import { VerifyIfIsProjectUserError } from './sdk-secrets.errors';

@Injectable()
export class SdkSecretsService {
  constructor(private readonly prisma: PrismaService) {}

  private hashSdkSecret(clearSecret: string): string {
    return createHash('sha256').update(clearSecret).digest('hex');
  }

  private generateSecretPreview(secret: string): string {
    return `${secret.slice(0, 4)}...${secret.slice(-5)}`;
  }

  private generateSecret(): string {
    return randomBytes(32).toString('hex');
  }

  private async verifyIfProjectUser(params: {
    userId: string;
    projectId: string;
  }): PResult<{ isVerified: true }, VerifyIfIsProjectUserError> {
    const { userId, projectId } = params;
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
      include: {
        organization: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!project) {
      return err('ProjectNotFound');
    }

    if (!project?.organization?.users?.find((user) => user.userId === userId)) {
      return err('NotAProjectUser');
    }

    return ok({ isVerified: true });
  }

  async createSecret(dto: { projectId: string; creatorId: string }) {
    const { projectId, creatorId } = dto;

    const verifyResult = await this.verifyIfProjectUser({
      userId: creatorId,
      projectId,
    });

    if (!verifyResult.ok) {
      return err(verifyResult.error);
    }

    const clearSecret = this.generateSecret();
    const hashedSecret = this.hashSdkSecret(clearSecret);
    const previewSecret = this.generateSecretPreview(clearSecret);

    const created = await this.prisma.sdkSecret.create({
      data: {
        hash: hashedSecret,
        preview: previewSecret,
        project: {
          connect: {
            id: projectId,
          },
        },
        creator: {
          connect: {
            id: creatorId,
          },
        },
      },
    });

    return ok(created);
  }

  async verifySdkSecret(
    projectId: string,
    clearSecret: string,
  ): Promise<boolean> {
    const hashedSecret = this.hashSdkSecret(clearSecret);

    const sdkSecrets = await this.prisma.sdkSecret.findFirst({
      where: {
        projectId,
        hash: hashedSecret,
        revokedAt: null,
      },
    });

    return !!sdkSecrets;
  }
}
