import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosInstance } from 'axios';
import { subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { AXIOS_INSTANCE } from '../common/http/axios.provider';
import { EXCEL_READER } from '../common/excel/excel.provider';
import type { ExcelReader } from '../common/excel/excel.provider';

import {
  LastChangedStatus,
  OrderDetail,
  SmartstoreResponse,
  OrderInfo,
} from './types';
import { parseProductOption } from '../common/utils';

@Injectable()
export class OrdersService {
  ADMIN_EMAIL_ADDR = 'sae1013@gmail.com';

  constructor(
    private readonly configService: ConfigService,
    @Inject(AXIOS_INSTANCE) private readonly http: AxiosInstance,
    @Inject(EXCEL_READER) private readonly excelReader: ExcelReader,
  ) {}

  /**
   * 자동화의 시작지점
   */
  async processOrders() {
    // STEP 1
    // 최근 주문목록들의 주문 ID 배열을 가져온다
    const paidOrderIds = await this.findLastChangedOrders();

    if (paidOrderIds.length < 1) {
      return;
    }

    // STEP 2
    // 결제된 항목들의 Order List를 가져온다.
    const ordersInfo: OrderDetail[] = await this.getOrdersInfo(paidOrderIds);
    console.log('ordersInfo:', ordersInfo);

    // STEP 3
    // orders info 를 순회하면서, 엑셀파일을 읽고 해당 하는 상품이 있는 경우 메일을 발송한다.
    // 만약 수량이 부족하면 관리자에게 메일을 보낸다.

    // 엑셀에서 가져온 row 데이터.
    const rows = await this.excelReader.readRows();

    ordersInfo.forEach((orderInfo) => {
      const { orderName, ordererId } = orderInfo.order;
      const { quantity, productName, productOption } = orderInfo.productOrder;
      const { amount, email } = parseProductOption(productOption);

      rows.forEach((row) => {
        const rowAmt = row[0] as string;
        const rowRedeemCd = row[1] as string;
        const useYn = row[2] as string;

        if (
          String(amount) === String(rowAmt) &&
          rowRedeemCd.trim() &&
          useYn.toLowerCase() === 'n'
        ) {
          console.log(amount, email, rowRedeemCd);
        }
      });
    });

    return ordersInfo;
  }

  async findLastChangedOrders(): Promise<string[]> {
    const params = {
      lastChangedFrom: this.getLastChangedFrom(1440),
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
  async getOrdersInfo(productOrderIds: string[]): Promise<OrderDetail[] | []> {
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
      return response.data.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  /**
   * N 분전 시간을 string으로변환
   * @param minutes
   * @private
   */
  private getLastChangedFrom(minutes: number): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const N_minutesAgo: Date = subMinutes(new Date(), minutes);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    return formatInTimeZone(
      N_minutesAgo,
      'Asia/Seoul',
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
    );
  }
}
