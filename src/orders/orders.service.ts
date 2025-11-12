import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosInstance } from 'axios';
import { subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { AXIOS_INSTANCE } from '../common/http/axios.provider';
import { EXCEL_READER } from '../common/excel/excel.provider';
import type { ExcelReader } from '../common/excel/excel.provider';
import type { GmailMailer } from 'src/common/email/gmail.provider';
import {
  LastChangedStatus,
  OrderDetail,
  SmartstoreResponse,
  OrderInfo,
} from './types';
import { parseProductOption } from '../common/utils';
import { GMAIL_MAILER } from 'src/common/email/gmail.provider';
import { genHtmlTemplate } from 'src/common/email/templates/template1';

@Injectable()
export class OrdersService {
  ADMIN_EMAIL_ADDR = 'sae1013@gmail.com';

  constructor(
    private readonly configService: ConfigService,
    @Inject(AXIOS_INSTANCE) private readonly http: AxiosInstance,
    @Inject(EXCEL_READER) private readonly excelReader: ExcelReader,
    @Inject(GMAIL_MAILER) private readonly gmailMailer: GmailMailer,
  ) {}

  /**
   * 자동화의 시작지점
   */
  async processOrders() {
    // 배송처리할 상품목록. 메일전송에 성공하면 채워넣는다.
    const productOrderIdList: string[] = [];

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

    for (const orderInfo of ordersInfo) {
      const { ordererName, ordererId, ordererTel } = orderInfo.order;
      const { quantity, productName, productOption, productOrderId } =
        orderInfo.productOrder;
      const { amount, email } = parseProductOption(productOption);

      let redeemCd = '';

      // 보낼 상품의 타겟 행
      const targetRow = rows.findIndex((row) => {
        const rowAmt = row[0] as string;
        redeemCd = row[1] as string;
        const useYn = row[2] as string;

        return (
          rowAmt === amount && useYn.toLowerCase() === 'n' && redeemCd.trim()
        );
      });

      // 해당 이메일 주소로 리딤코드 발송
      try {
        await this.gmailMailer.send({
          to: email,
          html: genHtmlTemplate(ordererName, redeemCd) as string,
          subject:
            '[애플기프트샵][자동발송] 애플 인도 앱스토어 아이튠즈 기프트카드',
        });

        productOrderIdList.push(productOrderId);
      } catch (err) {
        console.error('gmail sender Error:', err);
        continue;
      }

      try {
        await this.excelReader.writeRows(
          targetRow,
          'y',
          email,
          ordererName,
          ordererTel,
          ordererId,
        );
      } catch (err) {
        console.error(err);
      }

      await this.postDeliveryProducts(productOrderIdList);
    }
  }

  async findLastChangedOrders(): Promise<string[]> {
    const params = {
      lastChangedFrom: this.getLastChangedFrom(180),
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
   * 상품발송처리
   * @param productOrderIdList 상품 배열
   */
  async postDeliveryProducts(productOrderIdList) {
    const dispatchProductOrders = productOrderIdList.map((orderId) => {
      return {
        productOrderId: orderId,
        deliveryMethod: 'NOTHING',
        deliveryCompanyCode: '',
        trackingNumber: '',
        dispatchDate: this.formatGMT9TimeZone(new Date()),
      };
    });

    const payload = {
      dispatchProductOrders,
    };
    try {
      await this.http.post(
        '/v1/pay-order/seller/product-orders/dispatch',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return true;
    } catch (err) {
      console.error('postDeliveryProducts:', err);
      return false;
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

  private formatGMT9TimeZone(date: Date) {
    return formatInTimeZone(date, 'Asia/Seoul', "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
  }
}
