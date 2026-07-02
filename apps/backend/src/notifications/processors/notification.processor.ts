import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NOTIFICATION } from '../notification-queue.service';
import { NotificationsRepository } from '../notifications.repository';

@Processor(QUEUE_NOTIFICATION)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly repository: NotificationsRepository) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { userId, title, body, type, actionUrl } = job.data;
    this.logger.debug(`Processing notification: user=${userId} type=${type} job=${job.id}`);

    await this.repository.create({
      userId,
      title,
      body,
      type: type ?? 'SYSTEM',
      actionUrl,
    });
  }
}
