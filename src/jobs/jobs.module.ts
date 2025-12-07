import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { JobsScheduler } from './jobs.scheduler';

@Module({
  imports: [OrdersModule],
  providers: [JobsScheduler],
})
export class JobsModule {}
