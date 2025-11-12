import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, sheets_v4 } from 'googleapis';

export type ExcelCellValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export interface ExcelRow {
  [column: string]: ExcelCellValue;
}

export interface ExcelReadOptions {
  sheetName?: string;
  range?: string | number;
  raw?: boolean;
}

export interface ExcelReader {
  sheets?: sheets_v4.Sheets;

  readRows<T extends ExcelRow = ExcelRow>(
    filePath?: string,
    options?: ExcelReadOptions,
  ): Promise<T[]>;
}

export const EXCEL_READER = Symbol('EXCEL_READER');

const SHEETS_SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export const excelReaderProvider: Provider = {
  provide: EXCEL_READER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ExcelReader => {
    const auth = new google.auth.JWT({
      email: configService.get<string>('GOOGLE_CLIENT_EMAIL'),
      key: configService
        .get<string>('GOOGLE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n'),
      scopes: SHEETS_SCOPES,
    });

    const sheets = google.sheets({
      version: 'v4',
      auth,
    });

    const readRows = async <T extends ExcelRow = ExcelRow>() => {
      console.log('here???');
      const context = await sheets.spreadsheets.values.get({
        spreadsheetId: '1QHdgdW6bAVw6EDcTC3odAeVSyq9vONBPJU47-pMwt-8',
        range: '시트1!A2:C',
      });

      const rows = (context.data.values ?? []) as unknown as T[]; // 2차원 배열
      return rows;
    };

    return {
      readRows,
    };
  },
};
