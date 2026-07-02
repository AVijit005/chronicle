import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from '../auth';
import { SharedModule } from '../shared';
import { AnalyticsModule } from '../analytics';
import { WrappedModule } from '../wrapped';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { NotificationQueueService } from './notification-queue.service';
import { ReminderService } from './reminder.service';
import { DigestService } from './digest.service';
import { SchedulerService } from './scheduler.service';
import {
  NotificationProcessor,
  DigestProcessor,
  WrappedProcessor,
  AnalyticsProcessor,
  CleanupProcessor,
} from './processors';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    AnalyticsModule,
    WrappedModule,
    ScheduleModule.forRoot(),
    BullModule.registerQueue(
      { name: 'notification' },
      { name: 'email' },
      { name: 'wrapped' },
      { name: 'analytics' },
      { name: 'cleanup' },
    ),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    NotificationQueueService,
    ReminderService,
    DigestService,
    SchedulerService,
    NotificationProcessor,
    DigestProcessor,
    WrappedProcessor,
    AnalyticsProcessor,
    CleanupProcessor,
  ],
  exports: [NotificationsService, NotificationQueueService],
})
export class NotificationsModule {}
