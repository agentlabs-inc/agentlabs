import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import { InjectMailerConfig, MailerConfig } from './mailer.config';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter<nodemailer.SentMessageInfo>;

  constructor(
    @InjectMailerConfig()
    private readonly config: MailerConfig,
  ) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: true,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });
  }

  async sendEmailWithTemplate(params: {
    template: string;
    recipientEmail: string;
    subject: string;
    substitutions?: Record<string, string>;
  }) {
    const { template, recipientEmail, subject, substitutions } = params;

    const compiled = handlebars.compile(template);
    const html = compiled(substitutions ?? {});

    await this.transporter.sendMail({
      to: recipientEmail,
      from: this.config.senderAddress,
      subject: subject,
      html,
    });
  }
}
