import { Injectable, Logger } from '@nestjs/common';

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latencyMs: number;
  message?: string;
}

export interface DeploymentHealthReport {
  timestamp: Date;
  services: ServiceHealth[];
  overall: 'healthy' | 'degraded' | 'unhealthy';
}

@Injectable()
export class DeploymentHealthService {
  private readonly logger = new Logger(DeploymentHealthService.name);

  async checkAll(): Promise<DeploymentHealthReport> {
    const start = Date.now();
    const services: ServiceHealth[] = [
      { name: 'HTTP Server', status: 'healthy', latencyMs: 0 },
      { name: 'Metrics Endpoint', status: 'healthy', latencyMs: 0 },
    ];

    const overall = services.every((s) => s.status === 'healthy') ? 'healthy' : 'degraded';
    const elapsed = Date.now() - start;

    const report: DeploymentHealthReport = {
      timestamp: new Date(),
      services,
      overall,
    };

    this.logger.log(`Deployment health: ${overall} (${elapsed}ms)`);
    return report;
  }

  isHealthy(report: DeploymentHealthReport): boolean {
    return report.overall !== 'unhealthy';
  }
}
