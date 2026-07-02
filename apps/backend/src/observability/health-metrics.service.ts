import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import type { HealthCheckDetailsDto } from './dto';

@Injectable()
export class HealthMetricsService {
  private readonly logger = new Logger(HealthMetricsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  async getDatabaseHealth(): Promise<{ status: 'up' | 'down'; message?: string }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'up' };
    } catch (error) {
      return { status: 'down', message: `Database unreachable: ${(error as Error).message}` };
    }
  }

  async getRedisHealth(): Promise<{ status: 'up' | 'down'; message?: string }> {
    try {
      const client = this.redis.getClient();
      await client.ping();
      return { status: 'up' };
    } catch (error) {
      return { status: 'down', message: `Redis unreachable: ${(error as Error).message}` };
    }
  }

  async getBullmqHealth(): Promise<{ status: 'up' | 'down'; message?: string }> {
    try {
      // BullMQ uses Redis - if Redis is up, BullMQ is assumed healthy
      const redisHealth = await this.getRedisHealth();
      return redisHealth.status === 'up' ? { status: 'up' } : { status: 'down', message: 'BullMQ depends on Redis' };
    } catch (error) {
      return { status: 'down', message: `BullMQ: ${(error as Error).message}` };
    }
  }

  async getStorageHealth(): Promise<{ status: 'up' | 'down'; message?: string }> {
    try {
      const uploadRoot = this.config.get<string>('storage.uploadRoot', './uploads');
      // Verify the upload directory is writable
      const fs = await import('fs/promises');
      await fs.access(uploadRoot);
      return { status: 'up' };
    } catch (error) {
      return { status: 'down', message: `Storage: ${(error as Error).message}` };
    }
  }

  async getFullHealth(): Promise<HealthCheckDetailsDto> {
    const [database, redis, bullmq, storage] = await Promise.all([
      this.getDatabaseHealth(),
      this.getRedisHealth(),
      this.getBullmqHealth(),
      this.getStorageHealth(),
    ]);

    const details = { database, redis, bullmq, storage };
    const overall = Object.values(details).every((d) => d.status === 'up') ? 'up' : 'down';

    return { status: overall, details };
  }
}
