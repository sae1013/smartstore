import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CronTime } from 'cron';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { OrdersService } from '../orders/orders.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JobsScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(JobsScheduler.name);
  private cronJobNames: string[] = [];

  constructor(
    private readonly ordersService: OrdersService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 자동 발송 Cron
   */
  @Cron('*/5 * * * *', { name: 'auto-post' })
  handleCronSendProduct() {
    this.ordersService.processOrders();
  }

  @Cron('', { name: 'auto-stock-scale', disabled: true })
  handleCronAutoStockScale() {}

  onModuleInit(): any {
    const cronServiceType =
      this.configService.get<string>('cronServiceType') || '';
    if (cronServiceType === 'auto-post') {
      // 자동발송 크론잡
      const cronExpression =
        this.configService.get<string>('ORDERS_AUTO_PROCESS_CRON') ??
        '*/5 * * * *';
      const job = this.schedulerRegistry.getCronJob('auto-post');
      job.setTime(new CronTime(cronExpression));
    } else if (cronServiceType === 'auto-stock-scale') {
      // 자동 재고관리 크론잡
    }
    this.cronJobNames.push(cronServiceType);
    this.startJob(cronServiceType);
  }

  onModuleDestroy(): any {
    if (this.cronJobNames.length < 1) {
      return;
    }

    this.cronJobNames.forEach((jobName) => {
      const job = this.schedulerRegistry.getCronJob(jobName);
      job?.stop();
      this.schedulerRegistry.deleteCronJob(jobName);
    });
  }

  private startJob(name: string) {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      job.start();
      this.logger.log(`Scheduled order processing job registered (${name}).`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      this.logger.log(`Cron Init Error: ${name}`);
    }
  }
}
