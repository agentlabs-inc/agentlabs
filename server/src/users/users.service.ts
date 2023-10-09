import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { randomBytes, scryptSync } from 'crypto';
import * as jose from 'jose';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { PResult, Result, err, ok } from '../common/result';
import { MailerService } from '../mailer/mailer.service';
import { GoogleService } from '../oauth-providers/google/google.service';
import { LoginResponseDto } from './dtos/login.response.dto';
import { RegisterUserDto } from './dtos/register.user.dto';
import { SanitizedUserResponseDto } from './dtos/sanitized.user.response.dto';
import { UserCreatedResponseDto } from './dtos/user.created.response.dto';
import { WhoAmIResultDto } from './dtos/whoami.result.dto';
import { InjectUsersConfig, UsersConfig } from './users.config';
import {
  LoginUserError,
  OAuthLoginError,
  RegisterUserError,
  WhoAmIError,
} from './users.service.errors';
import { CreatePasswordHashConfig } from './users.types';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectUsersConfig()
    private readonly usersConfig: UsersConfig,
    private readonly mailerService: MailerService,
    private readonly googleService: GoogleService,
  ) {}

  private sanitizeUser(user: User): SanitizedUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      profilePictureUrl: user.profilePictureUrl,
      verifiedAt: user.verifiedAt,
    };
  }

  private async generateAccessToken(user: User): Promise<string> {
    return this.signAccessToken({
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    });
  }

  private signAccessToken(
    payload: Record<string, string | number>,
  ): Promise<string> {
    const secret = new TextEncoder().encode(this.usersConfig.accessTokenSecret);
    return new jose.SignJWT(payload)
      .setProtectedHeader({
        alg: 'HS256',
      })
      .setIssuer('https://agentlabs.dev')
      .setAudience('https://agentlabs.dev')
      .setExpirationTime(this.usersConfig.accessTokenExpirationTime)
      .setIssuedAt()
      .sign(secret);
  }

  private generatePasswordHashConfig(): CreatePasswordHashConfig {
    return {
      algorithm: 'scrypt',
      memCost: 16384,
      keyLength: 32,
      salt: randomBytes(16).toString('hex'),
    };
  }

  private generatePasswordHash(
    password: string,
    hashConfig: CreatePasswordHashConfig,
  ): string {
    const hash = scryptSync(password, hashConfig.salt, hashConfig.keyLength, {
      cost: hashConfig.memCost,
    });

    return hash.toString('hex');
  }

  private generateOrganizationId() {
    return uuid();
  }

  public async verifyAccessToken(jwt: string) {
    const secret = new TextEncoder().encode(this.usersConfig.accessTokenSecret);
    const { payload } = await jose.jwtVerify(jwt, secret);

    return payload;
  }

  async registerWithEmailAndPassword(
    dto: RegisterUserDto,
  ): Promise<Result<UserCreatedResponseDto, RegisterUserError>> {
    const hashConfig = this.generatePasswordHashConfig();

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // We generate the organization id here so we know the id during the transaction.
        const organizationId = this.generateOrganizationId();

        const userResult = await tx.user.create({
          data: {
            email: dto.email,
            passwordHash: this.generatePasswordHash(dto.password, hashConfig),
            fullName: dto.fullName,
            verifiedAt: null,
            passwordHashConfig: {
              create: {
                ...hashConfig,
              },
            },
            organizations: {
              create: [
                {
                  role: 'ADMIN',
                  organization: {
                    create: {
                      id: organizationId,
                      name: this.usersConfig.defaultOrganizationName,
                    },
                  },
                },
              ],
            },
          },
          include: {
            passwordHashConfig: false,
          },
        });

        await tx.onboarding.create({
          data: {
            hasAddedAuthMethod: false,
            hasUsedTheApplication: false,
            organization: {
              connect: {
                id: organizationId,
              },
            },
            user: {
              connect: {
                id: userResult.id,
              },
            },
          },
        });

        return userResult;
      });

      return ok({
        id: result.id,
        email: result.email,
        fullName: result.fullName,
        verifiedAt: result.verifiedAt,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return err('UserAlreadyExists');
        }
      }

      console.error('Error while registering user', e);

      throw e;
    }
  }

  async getWhoAmI(userId: string): PResult<WhoAmIResultDto, WhoAmIError> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        projectCreated: true,
        onboardings: true,
        organizations: {
          include: {
            organization: {
              include: {
                projects: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                  include: {
                    authMethods: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return err('UserNotFound');
    }

    const organization = user.organizations[0]?.organization;
    const onboarding = user.onboardings[0];

    return ok({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      verifiedAt: user.verifiedAt,
      defaultOrganizationId: organization.id ?? null,
      defaultProjectId: organization.projects[0]?.id ?? null,
      organizationCount: user.organizations.length,
      onboarding,
      projectCount: user.organizations.reduce(
        (acc, org) => acc + org.organization.projects.length,
        0,
      ),
      projectCreatedCount: user.projectCreated.length,
    });
  }

  async loginWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<Result<LoginResponseDto, LoginUserError>> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        passwordHashConfig: true,
      },
    });

    if (!user) {
      return err('UserNotFound');
    }

    if (!user.passwordHash) {
      return err('UserDoesNotHavePassword');
    }

    if (!user.passwordHashConfig) {
      return err('UserDoesNotHavePasswordHashConfig');
    }

    const hash = this.generatePasswordHash(password, user.passwordHashConfig);

    if (hash !== user.passwordHash) {
      return err('InvalidPassword');
    }

    const accessToken = await this.generateAccessToken(user);

    return ok({
      accessToken,
      user: this.sanitizeUser(user),
    });
  }

  findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  deserializeUser(userId: string): Promise<User | null> {
    const user = this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  }

  async findUserByIdOrThrow(id: string): Promise<User> {
    const user = await this.findUserById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  private async upsertUserWithOAuth(params: {
    email: string;
    fullName: string;
    pictureUrl: string;
    signInMethod: 'google';
    providerUserId: string;
    isVerified: boolean;
  }): Promise<User> {
    const { email, fullName, pictureUrl } = params;
    const userCreatedOrUpdated = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        const organizationId = this.generateOrganizationId();
        const userCreated = await tx.user.create({
          data: {
            email,
            fullName,
            profilePictureUrl: pictureUrl,
            verifiedAt: params.isVerified ? new Date() : null,
            organizations: {
              create: [
                {
                  role: 'ADMIN',
                  organization: {
                    create: {
                      id: organizationId,
                      name: this.usersConfig.defaultOrganizationName,
                    },
                  },
                },
              ],
            },
          },
        });

        await tx.onboarding.create({
          data: {
            hasAddedAuthMethod: false,
            hasUsedTheApplication: false,
            organization: {
              connect: {
                id: organizationId,
              },
            },
            user: {
              connect: {
                id: userCreated.id,
              },
            },
          },
        });

        return userCreated;
      }

      const userUpdated = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: email,
          fullName: fullName ?? user.fullName,
          profilePictureUrl: pictureUrl ?? user.profilePictureUrl,
          verifiedAt:
            user.verifiedAt ?? (params.isVerified ? new Date() : null),
        },
      });

      return userUpdated;
    });

    return userCreatedOrUpdated;
  }

  async completeOAuthLogin(params: {
    code: string;
    state: string;
    redirectUri: string;
    providerId: string;
  }): PResult<LoginResponseDto, OAuthLoginError> {
    const { providerId, code, state, redirectUri } = params;

    if (providerId !== 'google') {
      return err('UnsupportedOAuthProvider');
    }

    const clientSecret = this.usersConfig.oauthGoogleClientSecret;
    const clientId = this.usersConfig.oauthGoogleClientId;

    if (!clientSecret) {
      return err('MissingClientSecret');
    }

    if (!clientId) {
      return err('MissingClientId');
    }

    const result = await this.googleService.getToken({
      code,
      clientSecret,
      clientId,
      redirectUri,
    });

    if (!result) {
      return err('TokenRequestFailed');
    }

    const user = await this.googleService.getUserInfo(result.access_token);

    if (!user) {
      return err('ImpossibleToGetUserInfo');
    }

    const userCreatedOrUpdated = await this.upsertUserWithOAuth({
      email: user.email,
      fullName: user.name,
      pictureUrl: user.picture,
      signInMethod: 'google',
      providerUserId: user.sub,
      isVerified: user.email_verified,
    });

    const ourAccessToken = await this.generateAccessToken(userCreatedOrUpdated);

    return ok({
      accessToken: ourAccessToken,
      user: this.sanitizeUser(userCreatedOrUpdated),
    });
  }
}
