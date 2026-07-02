/* eslint-disable @typescript-eslint/no-explicit-any */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_CLEANUP } from '../notification-queue.service';
import { PrismaService } from '../../prisma/prisma.service';

@Processor(QUEUE_CLEANUP)
export class CleanupProcessor extends WorkerHost {
  private readonly logger = new Logger(CleanupProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { type } = job.data;
    this.logger.debug(`Running cleanup: type=${type} job=${job.id}`);

    switch (type) {
      case 'expired-tokens': {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        await this.prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lt: cutoff } } });
        break;
      }
      case 'old-sessions': {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 90);
        await this.prisma.session.deleteMany({ where: { updatedAt: { lt: cutoff }, status: 'ACTIVE' } as any });
        break;
      }
      case 'expired-refresh': {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        await this.prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: cutoff } } });
        break;
      }
      default:
        this.logger.warn(`Unknown cleanup type: ${type}`);
    }
  }
}
