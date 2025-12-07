import { Module } from '@nestjs/common';
import { HttpModule } from '../common/http/http.module';
import { excelReaderProvider } from '../common/excel/excel.provider';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [HttpModule],
  controllers: [StockController],
  providers: [StockService, excelReaderProvider],
  exports: [StockService],
})
export class StockModule {}
