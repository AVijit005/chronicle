import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_ANALYTICS } from '../notification-queue.service';
import { AnalyticsRepository } from '../../analytics/analytics.repository';

@Processor(QUEUE_ANALYTICS)
export class AnalyticsProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalyticsProcessor.name);

  constructor(private readonly analyticsRepo: AnalyticsRepository) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { userId } = job.data;
    this.logger.debug(`Refreshing analytics snapshot: user=${userId} job=${job.id}`);

    await this.analyticsRepo.saveSnapshot(userId, {
      moviesCompleted: 0,
      episodesWatched: 0,
      booksFinished: 0,
      gamesFinished: 0,
      coursesCompleted: 0,
      hoursWatched: 0,
      hoursPlayed: 0,
      hoursRead: 0,
      hoursLearned: 0,
      favoriteGenre: null,
      metadata: { refreshedAt: new Date().toISOString() },
    });
  }
}
