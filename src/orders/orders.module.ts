import { Module } from '@nestjs/common';
import { HttpModule } from '../common/http/http.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [HttpModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
