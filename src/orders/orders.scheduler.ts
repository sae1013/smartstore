import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrdersScheduler.name);
  private readonly jobName = 'orders-auto-process';
  private cronJob?: CronJob;

  constructor(
    private readonly ordersService: OrdersService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit(): void {
    const cronExpression =
      this.configService.get<string>('ORDERS_AUTO_PROCESS_CRON') ??
      '*/5 * * * *';

    this.cronJob = new CronJob(cronExpression, () => {
      // void this.handleAutoProcess();
    });

    this.schedulerRegistry.addCronJob(this.jobName, this.cronJob);
    this.cronJob.start();
    this.logger.log(
      `Scheduled order processing job registered (${cronExpression}).`,
    );
  }

  onModuleDestroy(): void {
    if (!this.cronJob) {
      return;
    }

    this.cronJob.stop();
    this.schedulerRegistry.deleteCronJob(this.jobName);
  }

  async handleAutoProcess(): Promise<void> {
    this.logger.log('Running scheduled order processing');
    try {
      await this.ordersService.processOrders();
    } catch (error) {
      this.logger.error('Scheduled order processing failed', error as Error);
    }
  }
}
