import { Injectable, Logger } from '@nestjs/common';

export interface ProductionSetting {
  category: string;
  setting: string;
  value: string;
  recommendation: string;
}

export interface ProductionConfigurationReport {
  timestamp: Date;
  settings: ProductionSetting[];
  ready: boolean;
}

@Injectable()
export class ProductionConfigurationService {
  private readonly logger = new Logger(ProductionConfigurationService.name);

  getRecommendedConfiguration(): ProductionConfigurationReport {
    const settings: ProductionSetting[] = [
      // Node.js
      {
        category: 'Node.js',
        setting: 'NODE_ENV',
        value: process.env.NODE_ENV || 'not set',
        recommendation: 'production',
      },
      {
        category: 'Node.js',
        setting: 'NODE_OPTIONS',
        value: process.env.NODE_OPTIONS || 'not set',
        recommendation: '--max-old-space-size=4096',
      },
      {
        category: 'Node.js',
        setting: 'Worker count',
        value: '1 (default)',
        recommendation: 'Use PM2 cluster mode or Kubernetes replicas',
      },

      // Database
      {
        category: 'Database',
        setting: 'Connection pool',
        value: 'Prisma default (10)',
        recommendation: 'Set DATABASE_POOL_SIZE=20 for production',
      },
      { category: 'Database', setting: 'Statement timeout', value: 'None', recommendation: 'Set 30s query timeout' },
      {
        category: 'Database',
        setting: 'SSL',
        value: process.env.DATABASE_URL?.includes('sslmode') ? 'Enabled' : 'Not configured',
        recommendation: 'Enable SSL for production',
      },

      // Redis
      {
        category: 'Redis',
        setting: 'Host',
        value: process.env.REDIS_HOST || 'localhost',
        recommendation: 'Use TLS for external Redis',
      },
      {
        category: 'Redis',
        setting: 'Password',
        value: process.env.REDIS_PASSWORD ? 'Set' : 'Not set',
        recommendation: 'Set a strong Redis password',
      },

      // Security
      {
        category: 'Security',
        setting: 'JWT access secret',
        value: process.env.JWT_ACCESS_SECRET ? 'Set' : 'Not set',
        recommendation: 'Use 256-bit random secret',
      },
      {
        category: 'Security',
        setting: 'JWT refresh secret',
        value: process.env.JWT_REFRESH_SECRET ? 'Set' : 'Not set',
        recommendation: 'Use different 256-bit random secret',
      },
      {
        category: 'Security',
        setting: 'CORS origin',
        value: process.env.CORS_ORIGIN || 'Not set (open)',
        recommendation: 'Set to your frontend domain',
      },
      {
        category: 'Security',
        setting: 'Cookie domain',
        value: process.env.COOKIE_DOMAIN || 'Not set',
        recommendation: 'Set to your domain',
      },

      // Storage
      {
        category: 'Storage',
        setting: 'Provider',
        value: process.env.S3_BUCKET
          ? 'S3'
          : process.env.R2_BUCKET
            ? 'R2'
            : process.env.MINIO_BUCKET
              ? 'MinIO'
              : 'Local',
        recommendation: 'Use S3 or R2 for production',
      },

      // Monitoring
      {
        category: 'Monitoring',
        setting: 'Log level',
        value: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        recommendation: 'info in production, debug for troubleshooting',
      },
      {
        category: 'Monitoring',
        setting: 'Metrics',
        value: 'Enabled (GET /api/metrics)',
        recommendation: 'Scrape with Prometheus',
      },
    ];

    const ready =
      settings.filter((s) => {
        if (s.category === 'Node.js' && s.setting === 'NODE_ENV') return s.value === 'production';
        return true;
      }).length === settings.length;

    return { timestamp: new Date(), settings, ready };
  }
}
