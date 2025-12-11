import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { OrdersService } from '../orders/orders.service';
import { StockService } from '../stock/stock.service';

@Injectable()
export class JobsScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(JobsScheduler.name);
  private readonly registeredJobNames = new Set<string>();

  constructor(
    private readonly ordersService: OrdersService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
    private readonly stockService: StockService,
  ) {}

  onModuleInit(): void {
    const cronServiceType =
      this.configService.get<string>('CRON_SERVICE_TYPE') ?? '';
    const env = this.configService.get<string>('ENV') ?? 'DEV';
    if (env === 'DEV') {
      return;
    }

    switch (cronServiceType) {
      case 'auto-post':
        this.registerAutomationJob();
        break;
      case 'auto-stock-scale':
        this.registerStockJob();
        break;
      default:
        this.logger.warn(
          `No cron job configured for service type: ${cronServiceType}`,
        );
        break;
    }
  }

  onModuleDestroy(): void {
    this.registeredJobNames.forEach((jobName) => {
      try {
        const job = this.schedulerRegistry.getCronJob(jobName);
        job.stop();
        this.schedulerRegistry.deleteCronJob(jobName);
      } catch {
        this.logger.warn(`Cron job already cleaned up: ${jobName}`);
      }
    });
    this.registeredJobNames.clear();
  }

  private registerAutomationJob(): void {
    const cronExpression =
      this.configService.get<string>('ORDERS_AUTO_PROCESS_CRON') ??
      '*/5 * * * *';

    this.registerCronJob({
      name: 'auto-post',
      cronExpression,
      onTick: async () => {
        try {
          await this.ordersService.processOrders();
        } catch (error) {
          this.logger.error('Automation cron job failed', error as Error);
        }
      },
    });
  }

  private registerStockJob(): void {
    const cronExpression =
      this.configService.get<string>('STOCK_AUTO_PROCESS_CRON') ?? '';

    if (!cronExpression) {
      this.logger.warn('ORDERS_STOCK_CRON is not configured');
      return;
    }

    this.registerCronJob({
      name: 'auto-stock-scale',
      cronExpression,
      onTick: async () => {
        try {
          await this.stockService.updateOptionStock();
        } catch (e) {
          this.logger.warn('Stock job cron Error:', e);
        }
      },
    });
  }

  private registerCronJob({
    name,
    cronExpression,
    onTick,
  }: {
    name: string;
    cronExpression: string;
    onTick: () => Promise<void> | void;
  }): void {
    if (!cronExpression) {
      this.logger.warn(`Cron expression missing for job: ${name}`);
      return;
    }

    try {
      let job: CronJob | undefined;
      try {
        job = this.schedulerRegistry.getCronJob(name);
      } catch {
        job = undefined;
      }

      if (job) {
        job.stop();
        this.schedulerRegistry.deleteCronJob(name);
      }

      const cronJob = new CronJob(cronExpression, () => {
        void onTick();
      });

      this.schedulerRegistry.addCronJob(name, cronJob);
      cronJob.start();
      this.registeredJobNames.add(name);

      this.logger.log(
        `Scheduled cron job registered (${name}) - ${cronExpression}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to register cron job (${name})`,
        error as Error,
      );
    }
  }
}
