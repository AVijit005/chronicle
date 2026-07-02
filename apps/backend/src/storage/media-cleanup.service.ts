import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from './upload.service';

@Injectable()
export class MediaCleanupService {
  private readonly logger = new Logger(MediaCleanupService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async cleanupOrphanedAvatars(): Promise<number> {
    let cleaned = 0;

    // Get all avatar paths from the database
    const users = await this.prisma.user.findMany({
      where: { avatar: { not: null } },
      select: { id: true, avatar: true },
    });

    for (const user of users) {
      if (user.avatar && !user.avatar.startsWith('avatars/')) continue;
      try {
        await this.uploadService.delete(user.avatar!);
        cleaned++;
      } catch {
        // File might not exist - that's ok
      }
    }

    return cleaned;
  }

  async cleanupExpiredUploads(): Promise<number> {
    // In production, this would check a file registry table
    // For now, this is a placeholder for the cleanup queue processor
    this.logger.log('Expired upload cleanup triggered');
    return 0;
  }

  async findOrphanedFiles(): Promise<string[]> {
    const orphans: string[] = [];

    // Check avatars directory for files not referenced in DB
    // Simplified: in production this would scan the upload directory
    // and compare against all known file references

    return orphans;
  }
}
