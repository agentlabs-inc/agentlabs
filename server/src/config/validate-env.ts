import { AttachmentStorageDriver } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPort,
  IsString,
  ValidateIf,
  validateSync,
} from 'class-validator';

export class Environment {
  @IsOptional()
  @IsPort()
  PORT?: string;

  @IsString()
  USERS_ACCESS_TOKEN_SECRET: string;

  @IsString()
  MEMBERS_ACCESS_TOKEN_SECRET: string;

  @IsNumber()
  MEMBERS_AUTH_CODE_EXPIRATION_DELAY_IN_MINUTES: number;

  @IsOptional()
  @IsEnum(AttachmentStorageDriver)
  AGENT_ATTACHMENT_STORAGE_DRIVER: AttachmentStorageDriver =
    'LOCAL_FILE_SYSTEM';

  @ValidateIf(
    (env) => env.AGENT_ATTACHMENT_STORAGE_DRIVER === 'GOOGLE_CLOUD_STORAGE',
  )
  GOOGLE_CLOUD_STORAGE_SERVICE_ACCOUNT_BASE64?: string;

  @IsString()
  SMTP_HOST: string;

  @IsNumber()
  SMTP_PORT: number;

  @IsString()
  SMTP_USERNAME: string;

  @IsString()
  SMTP_PASSWORD: string;

  @IsString()
  EMAIL_SENDER_ADDRESS: string;

  @IsString()
  EMAIL_SENDER_NAME: string;

  @IsString()
  USERS_OAUTH_GOOGLE_CLIENT_ID: string;

  @IsString()
  USERS_OAUTH_GOOGLE_CLIENT_SECRET: string;

  @IsString()
  MEMBERS_DEMO_OAUTH_GOOGLE_CLIENT_ID: string;

  @IsString()
  MEMBERS_DEMO_OAUTH_GOOGLE_CLIENT_SECRET: string;
}

export const validateEnv = (env: NodeJS.ProcessEnv) => {
  const validatedEnv = plainToClass(Environment, env, {
    enableImplicitConversion: true,
  });

  if (env.SKIP_ENV_VALIDATION) {
    return validatedEnv;
  }

  const validationErrors = validateSync(validatedEnv, {
    skipMissingProperties: false,
  });

  if (validationErrors.length > 0) {
    throw new Error(
      `Environment validation error: ${validationErrors.join(', ')}`,
    );
  }

  console.log(validatedEnv);

  return validatedEnv;
};
