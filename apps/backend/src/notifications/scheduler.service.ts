import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { NotificationQueueService } from './notification-queue.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly queueService: NotificationQueueService,
  ) {}

  onModuleInit(): void {
    this.registerDailyCleanup();
    this.registerWeeklyDigest();
    this.registerMonthlyDigest();
    this.registerTokenCleanup();
    this.logger.log('Scheduler jobs registered');
  }

  private registerDailyCleanup(): void {
    const job = new CronJob('0 3 * * *', async () => {
      this.logger.log('Running daily cleanup jobs');
      await this.queueService.scheduleCleanup('expired-tokens');
      await this.queueService.scheduleCleanup('old-sessions');
      await this.queueService.scheduleCleanup('expired-refresh');
    });
    this.schedulerRegistry.addCronJob('daily-cleanup', job);
    job.start();
  }

  private registerWeeklyDigest(): void {
    const job = new CronJob('0 9 * * 1', async () => {
      this.logger.log('Weekly digest job triggered');
      // Digest generation would iterate over all active users
    });
    this.schedulerRegistry.addCronJob('weekly-digest', job);
    job.start();
  }

  private registerMonthlyDigest(): void {
    const job = new CronJob('0 10 1 * *', async () => {
      this.logger.log('Monthly digest job triggered');
    });
    this.schedulerRegistry.addCronJob('monthly-digest', job);
    job.start();
  }

  private registerTokenCleanup(): void {
    const job = new CronJob('0 4 * * 0', async () => {
      this.logger.log('Weekly token cleanup');
      await this.queueService.scheduleCleanup('expired-refresh');
    });
    this.schedulerRegistry.addCronJob('token-cleanup', job);
    job.start();
  }
}
