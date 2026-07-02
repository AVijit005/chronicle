import { Injectable, Logger } from '@nestjs/common';
import * as os from 'os';
import { setImmediate } from 'node:timers';
import type { SystemMetricsDto } from './dto';

@Injectable()
export class PerformanceService {
  private readonly logger = new Logger(PerformanceService.name);
  private lastCpuUsage = process.cpuUsage();
  private lastCpuTime = Date.now();

  async getSystemMetrics(): Promise<SystemMetricsDto> {
    const memory = process.memoryUsage();
    const totalMem = os.totalmem();

    return {
      memory: {
        totalMb: this.toMb(totalMem),
        usedMb: this.toMb(totalMem - os.freemem()),
        freeMb: this.toMb(os.freemem()),
        heapUsedMb: this.toMb(memory.heapUsed),
        heapTotalMb: this.toMb(memory.heapTotal),
        rssMb: this.toMb(memory.rss),
      },
      cpu: {
        loadAvg: os.loadavg(),
        usagePercent: this.getCpuUsagePercent(),
      },
      eventLoop: {
        lagMs: await this.getEventLoopLag(),
      },
      uptimeSeconds: process.uptime(),
    };
  }

  private getCpuUsagePercent(): number {
    const currentUsage = process.cpuUsage();
    const currentTime = Date.now();
    const elapsed = (currentTime - this.lastCpuTime) * 1000; // microseconds
    const userDiff = currentUsage.user - this.lastCpuUsage.user;
    const sysDiff = currentUsage.system - this.lastCpuUsage.system;

    this.lastCpuUsage = currentUsage;
    this.lastCpuTime = currentTime;

    if (elapsed === 0) return 0;
    return Math.round(((userDiff + sysDiff) / elapsed) * 10000) / 100;
  }

  private getEventLoopLag(): Promise<number> {
    return new Promise<number>((resolve) => {
      const start = Date.now();
      setImmediate(() => resolve(Date.now() - start));
    });
  }

  private toMb(bytes: number): number {
    return Math.round((bytes / 1024 / 1024) * 100) / 100;
  }
}
