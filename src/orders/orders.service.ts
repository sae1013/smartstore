import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosInstance } from 'axios';
import { subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { AXIOS_INSTANCE } from '../common/http/axios.provider';
import {
  LastChangedStatus,
  OrderDetail,
  SmartstoreResponse,
  OrderInfo,
} from './types';

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
    if (!paidOrderIds.length) {
      return;
    }
    const ordersInfo = await this.getOrdersInfo(paidOrderIds);

    return ordersInfo;
  }

  async findLastChangedOrders(): Promise<string[]> {
    const params = {
      lastChangedFrom: this.getLastChangedFrom(),
    };
    try {
      const response = await this.http.get<
        SmartstoreResponse<LastChangedStatus>
      >('/v1/pay-order/seller/product-orders/last-changed-statuses', {
        params,
      });
      const lastChangeStatuses: OrderInfo[] =
        response.data.data?.lastChangeStatuses ?? [];

      return this.getPaidOrderIds(lastChangeStatuses);
    } catch (err) {
      console.log('minwooerr', err);
      return [];
    }
  }

  getPaidOrderIds(orderInfoList: OrderInfo[]) {
    return orderInfoList
      .filter((x) => x.lastChangedType === 'PAYED')
      .map((x) => x.productOrderId);
  }

  /**
   * 상품 상세조회
   * @param productOrderIds
   */
  async getOrdersInfo(
    productOrderIds: string[],
  ): Promise<OrderDetail[] | undefined> {
    const payload = {
      productOrderIds,
    };
    try {
      const response = await this.http.post<SmartstoreResponse<OrderDetail[]>>(
        '/v1/pay-order/seller/product-orders/query',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.data;
    } catch (err) {
      console.error(err);
      return undefined;
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
