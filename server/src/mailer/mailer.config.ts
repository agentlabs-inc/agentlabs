import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { validateEnv } from 'src/config/validate-env';

export interface MailerConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  senderAddress: string;
  senderName: string;
}

export const mailerConfig = registerAs<MailerConfig>(
  'MailerConfig',
  (): MailerConfig => {
    const env = validateEnv(process.env);

    return {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      user: env.SMTP_USERNAME,
      password: env.SMTP_PASSWORD,
      senderAddress: env.EMAIL_SENDER_ADDRESS,
      senderName: env.EMAIL_SENDER_NAME,
    };
  },
);

export const InjectMailerConfig = () => Inject(mailerConfig.KEY);
