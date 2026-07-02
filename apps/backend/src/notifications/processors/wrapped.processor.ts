import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_WRAPPED } from '../notification-queue.service';
import { WrappedService } from '../../wrapped/wrapped.service';

@Processor(QUEUE_WRAPPED)
export class WrappedProcessor extends WorkerHost {
  private readonly logger = new Logger(WrappedProcessor.name);

  constructor(private readonly wrappedService: WrappedService) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { userId, year } = job.data;
    this.logger.debug(`Generating wrapped: user=${userId} year=${year} job=${job.id}`);

    try {
      // Attempt to generate; ignore conflict if already exists
      await this.wrappedService.generate(userId, year);
    } catch {
      this.logger.debug(`Wrapped already exists for user=${userId} year=${year}`);
    }
  }
}
