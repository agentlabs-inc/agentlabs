import { Injectable } from '@nestjs/common';
import { SdkSecret } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { PResult, err, ok } from '../common/result';
import { PrismaService } from '../prisma/prisma.service';
import { CreatedSdkSecretDto } from './dtos/created.sdk-secret.dto';
import { SanitizedSdkSecretDto } from './dtos/sanitized.sdk-secret.dto';
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

  private sanitizeSecret(secret: SdkSecret): SanitizedSdkSecretDto {
    return {
      id: secret.id,
      description: secret.description,
      projectId: secret.projectId,
      preview: secret.preview,
      createdAt: secret.createdAt,
      updatedAt: secret.updatedAt,
    };
  }

  async createSecret(dto: {
    projectId: string;
    creatorId: string;
  }): PResult<CreatedSdkSecretDto, VerifyIfIsProjectUserError> {
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

    return ok({
      ...this.sanitizeSecret(created),
      clearValue: clearSecret,
    });
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
