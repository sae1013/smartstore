import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosInstance } from 'axios';
import { AXIOS_INSTANCE } from '../common/http/axios.provider';
import { NAVER_COMMERCE_API } from '../common/utils';

@Injectable()
export class OrdersService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AXIOS_INSTANCE) private readonly http: AxiosInstance,
  ) {}

  async findAll(): Promise<string[]> {
    try {
      const response = await this.http.get(NAVER_COMMERCE_API.AUTH.TOKEN_URL);
      console.log(response);
    } catch (err) {}
  }
}
