export class MetricsResponseDto {
  counters: Record<string, number>;
  gauges: Record<string, number>;
  histograms: Record<string, { count: number; sum: number; avg: number; min: number; max: number }>;
  uptime: number;
}

export class HealthCheckDetailsDto {
  status: 'up' | 'down';
  details: Record<string, { status: 'up' | 'down'; message?: string }>;
}

export class QueueMetricsDto {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

export class DatabaseMetricsDto {
  queryCount: number;
  averageQueryTimeMs: number;
  slowQueries: number;
  connections: number;
}

export class SystemMetricsDto {
  memory: {
    totalMb: number;
    usedMb: number;
    freeMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
  };
  cpu: {
    loadAvg: number[];
    usagePercent: number;
  };
  eventLoop: {
    lagMs: number;
  };
  uptimeSeconds: number;
}

export class PrometheusMetric {
  name: string;
  help: string;
  type: string;
  value: number;
  labels?: Record<string, string>;
}

export class TracingSpan {
  name: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  startTime: Date;
  endTime?: Date;
  durationMs?: number;
  attributes: Record<string, string | number | boolean>;
  status: 'ok' | 'error';
}
