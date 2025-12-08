import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { JobsScheduler } from './jobs.scheduler';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [OrdersModule, StockModule],
  providers: [JobsScheduler],
})
export class JobsModule {}
