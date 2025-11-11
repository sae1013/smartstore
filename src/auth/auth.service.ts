import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AXIOS_INSTANCE } from '../common/http/axios.provider';
import type { AxiosInstance } from 'axios';
import { NAVER_COMMERCE_API } from '../common/utils';
// export interface SmartstoreCredentials {
//   clientId: string;
//   clientSecret: string;
// }

@Injectable()
export class AuthService {
  clientId: string;
  clientSecret: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(AXIOS_INSTANCE) private readonly http: AxiosInstance,
  ) {
    this.clientId = this.configService.get<string>('STORE_APP_ID') || '';
    this.clientSecret =
      this.configService.get<string>('STORE_APP_SECRET') || '';
  }

  async requestToken() {
    const timestamp = Date.now();
    const signature = this.generateSignature(timestamp);

    const param = {
      client_id: this.clientId,
      timestamp: timestamp,
      grant_type: 'client_credentials',
      client_secret_sign: signature,
      type: 'SELF',
    };
    try {
      const res = await this.http.post(
        NAVER_COMMERCE_API.AUTH.TOKEN_URL,
        param,
      );
      const { access_token, refrsh_token } = res.data;
    } catch (err: unknown) {
      console.error(err);
    }
  }

  generateSignature(timestamp: number) {
    const password = `${this.clientId}_${timestamp}`;

    return Buffer.from(
      bcrypt.hashSync(password, this.clientSecret),
      'utf-8',
    ).toString('base64');
  }
}
