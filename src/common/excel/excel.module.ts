import { Module } from '@nestjs/common';
import { excelReaderProvider } from './excel.provider';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { HttpModule } from '../http/http.module';

@Module({
  imports: [HttpModule],
  controllers: [ExcelController],
  providers: [ExcelService, excelReaderProvider],
  exports: [ExcelService],
})
export class ExcelModule {}
