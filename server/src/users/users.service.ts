import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { randomBytes, scryptSync } from 'crypto';
import * as jose from 'jose';
import { PrismaService } from 'src/prisma/prisma.service';
import { Result, err, ok } from '../common/result';
import { LoginResponseDto } from './dtos/login.response.dto';
import { RegisterUserDto } from './dtos/register.user.dto';
import { SanitizedUserResponseDto } from './dtos/sanitized.user.response.dto';
import { UserCreatedResponseDto } from './dtos/user.created.response.dto';
import { InjectUsersConfig, UsersConfig } from './users.config';
import { LoginUserError, RegisterUserError } from './users.service.errors';
import { CreatePasswordHashConfig } from './users.types';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectUsersConfig()
    private readonly usersConfig: UsersConfig,
  ) {}

  private sanitizeUser(user: User): SanitizedUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
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

  async registerWithEmailAndPassword(
    dto: RegisterUserDto,
  ): Promise<Result<UserCreatedResponseDto, RegisterUserError>> {
    const hashConfig = this.generatePasswordHashConfig();

    try {
      const result = await this.prisma.user.create({
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
}
