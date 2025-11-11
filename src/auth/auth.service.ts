import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AXIOS_INSTANCE } from '../common/http/axios.provider';
import { NAVER_COMMERCE_API } from '../common/utils';

export interface TokenResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  clientId: string;
  clientSecret: string;
  private accessToken: string | null = null;

  constructor(
    private readonly configService: ConfigService,
    @Inject(AXIOS_INSTANCE) private readonly http: AxiosInstance,
  ) {
    this.clientId = this.configService.get<string>('STORE_APP_ID') || '';
    this.clientSecret =
      this.configService.get<string>('STORE_APP_SECRET') || '';
    this.registerAuthInterceptor();
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
      const res = await this.http.post<TokenResponse>(
        NAVER_COMMERCE_API.AUTH.TOKEN_URL,
        param,
      );
      const { access_token } = res.data;
      this.accessToken = access_token;
      console.log(access_token);
      return this.accessToken;
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

  private registerAuthInterceptor() {
    this.http.interceptors.request.use(
      // 매 요청전에 인증 호출
      async (config: InternalAxiosRequestConfig) => {
        await this.requestToken();
        if (this.accessToken) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
    );
  }
}
