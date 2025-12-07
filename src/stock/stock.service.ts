import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AXIOS_INSTANCE } from '../common/http/axios.provider';
import type { AxiosInstance } from 'axios';
import type { ExcelReader } from '../common/excel/excel.provider';
import { EXCEL_READER } from '../common/excel/excel.provider';
import { optionMapperByValue, ORIGINAL_PRODUCT_ID } from './const/optionMapper';

@Injectable()
export class StockService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AXIOS_INSTANCE) private readonly http: AxiosInstance,
    @Inject(EXCEL_READER) private readonly excelReader: ExcelReader,
  ) {}

  async getStockByOptions() {
    const rows = await this.excelReader.readRows();
    // 각 로우 별로 파싱해서 object 키 값 형태로 내려준다.
    const optionStockTable = rows.reduce((acc, cur) => {
      const [value, _, useYn] = cur as unknown as string[];
      if ((useYn as unknown as string).toLowerCase() === 'n') {
        acc.set(value, (acc.get(value) ?? 0) + 1);
      }
      return acc;
    }, new Map());

    // 'y' 인경우도 세서 - 하는경우 보정로직
    for (const [key, value] of optionStockTable) {
      if (value < 0) {
        optionStockTable.set(key, 0);
      }
    }
    return optionStockTable;
  }

  async updateOptionStock() {
    const optionStockTable = await this.getStockByOptions();
    const bodyParam = {
      productSalePrice: {
        salePrice: 2800,
      },
      optionInfo: {
        optionCombinations: Array.from(optionStockTable).map(([k, v]) => {
          return {
            id: parseInt(
              optionMapperByValue[k as keyof typeof optionMapperByValue].code,
              10,
            ),
            stockQuantity: v,
            price:
              optionMapperByValue[k as keyof typeof optionMapperByValue]?.price,
            usable: true,
          };
        }),
        useStockManagement: true,
      },
    };

    console.log('bodyParam', JSON.stringify(bodyParam));
    try {
      await this.http.post(
        `/v1/products/origin-products/${ORIGINAL_PRODUCT_ID}/option-stock`,
        bodyParam,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
    } catch (e) {
      console.log(e);
      console.error(e.message);
    }
  }
}
