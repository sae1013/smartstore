import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosInstance } from 'axios';
import { AXIOS_INSTANCE } from '../common/http/axios.provider';
// import { NAVER_COMMERCE_API } from '../common/utils';

@Injectable()
export class OrdersService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AXIOS_INSTANCE) private readonly http: AxiosInstance,
  ) {}

  async findLastChangedOrders() {
    try {
      const response = await this.http.get(
        '/v1/pay-order/seller/product-orders/last-changed-statuses',
      );
      console.log('minwooresponse', response);
    } catch (err) {
      console.log('minwooerr', err);
    }
  }
}
