import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { PerformanceService } from './performance.service';
import { HealthMetricsService } from './health-metrics.service';
import type { MetricsResponseDto, HealthCheckDetailsDto, SystemMetricsDto } from './dto';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly performanceService: PerformanceService,
    private readonly healthMetricsService: HealthMetricsService,
  ) {}

  @Get()
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @ApiOperation({ summary: 'Prometheus metrics endpoint' })
  getMetrics(): string {
    return this.metricsService.getAsPrometheus();
  }

  @Get('json')
  @ApiOperation({ summary: 'Metrics in JSON format' })
  getMetricsJson(): MetricsResponseDto {
    return this.metricsService.getAsJson();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check with full details' })
  async getHealth(): Promise<HealthCheckDetailsDto> {
    return this.healthMetricsService.getFullHealth();
  }

  @Get('system')
  @ApiOperation({ summary: 'System metrics (CPU, memory, event loop)' })
  async getSystemMetrics(): Promise<SystemMetricsDto> {
    return this.performanceService.getSystemMetrics();
  }
}
