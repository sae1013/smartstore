import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SendMailOptions, Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';

export interface NaverMailMessageOption {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: SendMailOptions['attachments'];
}

export interface NaverMailer {
  send(msgOption: NaverMailMessageOption): Promise<void>;
}

export const NAVER_MAILER = Symbol('NAVER_MAILER');

export const naverMailProvider: Provider = {
  provide: NAVER_MAILER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): NaverMailer => {
    const naverMailUser = configService.get<string>('NAVER_SMTP_USER');
    const naverMailPassword = configService.get<string>('NAVER_SMTP_PASSWORD');

    if (!naverMailUser) {
      throw new Error('NAVER_SMTP_USER is not configured');
    }

    if (!naverMailPassword) {
      throw new Error('NAVER_SMTP_PASSWORD is not configured');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const transporter: Transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 465,
      secure: true,
      auth: {
        user: naverMailUser,
        pass: naverMailPassword,
      },
    });

    const send = async (msgOption: NaverMailMessageOption): Promise<void> => {
      const options: SendMailOptions = {
        ...msgOption,
        from: msgOption.from ?? naverMailUser,
      };
      try {
        await transporter.sendMail(options);
      } catch (err) {
        console.log(err);
        throw new Error('메일전송 실패');
      }
    };

    return { send };
  },
};
