import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosInstance } from 'axios';
import { subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { AXIOS_INSTANCE } from '../common/http/axios.provider';
import { OrderInfo } from './types';

// import { NAVER_COMMERCE_API } from '../common/utils';

@Injectable()
export class OrdersService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AXIOS_INSTANCE) private readonly http: AxiosInstance,
  ) {}

  /**
   * 자동화의 시작지점
   */
  async processOrders() {
    const paidOrderIds = await this.findLastChangedOrders();
    const ordersInfo = await this.getOrdersInfo(paidOrderIds);
  }

  async findLastChangedOrders() {
    const params = {
      lastChangedFrom: this.getLastChangedFrom(),
    };
    try {
      const response = await this.http.get(
        '/v1/pay-order/seller/product-orders/last-changed-statuses',
        {
          params,
        },
      );
      const lastChangeStatuses: OrderInfo[] =
        response.data?.data?.lastChangeStatuses;

      const paidOrderIds = this.getPaidOrderIds(lastChangeStatuses);
      return paidOrderIds;
    } catch (err) {
      console.log('minwooerr', err);
    }
  }

  getPaidOrderIds(orderInfoList: OrderInfo[]) {
    return (
      orderInfoList
        .filter((x) => x.lastChangedType === 'PAYED')
        .map((x) => x.productOrderId) || []
    );
  }

  /**
   * 상품 상세내역 조회
   * @param productOrderIds: 주문 상품 배열
   */
  async getOrdersInfo(productOrderIds: string[]) {
    const payload = {
      productOrderIds,
    };
    try {
      const response = await this.http.post(
        '/v1/pay-order/seller/product-orders/query',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(response.data.data);
      return response.data.data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * 30 분 전 시간을 구하는 로직
   * @private
   */
  private getLastChangedFrom() {
    const thirtyMinutesAgo = subMinutes(new Date(), 240);
    return formatInTimeZone(
      thirtyMinutesAgo,
      'Asia/Seoul',
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
    );
  }
}
