import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';

export interface GmailMessageOption {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: SendMailOptions['attachments'];
}

export interface GmailMailer {
  send(msgOption: GmailMessageOption): Promise<void>;
}

export const GMAIL_MAILER = Symbol('GMAIL_MAILER');

export const gmailProvider: Provider = {
  provide: GMAIL_MAILER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): GmailMailer => {
    const gmailUser = configService.get<string>('GOOGLE_SMTP_USER');
    const gmailAppId = configService.get<string>('GOOGLE_SMTP_APP_ID');

    if (!gmailUser) {
      throw new Error('GOOGLE_SMTP_USER is not configured');
    }

    if (!gmailAppId) {
      throw new Error('GOOGLE_SMTP_APP_ID is not configured');
    }

    const transporter: Transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppId,
      },
    });

    const send = async (msgOption: GmailMessageOption): Promise<void> => {
      const options: SendMailOptions = {
        ...msgOption,
        from: msgOption.from ?? gmailUser,
      };
      try {
        await transporter.sendMail(options);
      } catch (err) {
        throw new Error('메일전송 실패');
      }
    };

    return { send };
  },
};
