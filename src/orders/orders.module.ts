import { Module } from '@nestjs/common';
import { HttpModule } from '../common/http/http.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { excelReaderProvider } from '../common/excel/excel.provider';
import { gmailProvider } from 'src/common/email/gmail.provider';
import { OrdersScheduler } from './orders.scheduler';

@Module({
  imports: [HttpModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    excelReaderProvider,
    gmailProvider,
    OrdersScheduler,
  ],
})
export class OrdersModule {}
