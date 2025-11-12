import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersScheduler {
  private readonly logger = new Logger(OrdersScheduler.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleAutoProcess(): Promise<void> {
    this.logger.log('Running scheduled order processing');
    try {
      await this.ordersService.processOrders();
    } catch (error) {
      this.logger.error('Scheduled order processing failed', error as Error);
    }
  }
}
