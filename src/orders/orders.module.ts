import { Module } from '@nestjs/common';
import { HttpModule } from '../common/http/http.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { excelReaderProvider } from '../common/excel/excel.provider';

@Module({
  imports: [HttpModule],
  controllers: [OrdersController],
  providers: [OrdersService, excelReaderProvider],
  //   ORdersService를 명시적으로 export 안해도되나?
})
export class OrdersModule {}
