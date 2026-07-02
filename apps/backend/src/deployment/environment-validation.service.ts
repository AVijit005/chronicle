import { Injectable, Logger } from '@nestjs/common';

export interface EnvValidationResult {
  variable: string;
  present: boolean;
  valid: boolean;
  message: string;
}

export interface EnvValidationReport {
  timestamp: Date;
  results: EnvValidationResult[];
  passed: boolean;
  missing: string[];
}

@Injectable()
export class EnvironmentValidationService {
  private readonly logger = new Logger(EnvironmentValidationService.name);

  private readonly REQUIRED_VARS = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

  private readonly OPTIONAL_VARS = [
    'REDIS_HOST',
    'REDIS_PORT',
    'REDIS_PASSWORD',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'S3_BUCKET',
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET',
    'MINIO_ENDPOINT',
    'MINIO_ACCESS_KEY',
    'MINIO_SECRET_KEY',
    'MINIO_BUCKET',
    'CORS_ORIGIN',
    'COOKIE_DOMAIN',
    'UPLOAD_ROOT',
    'APP_BASE_URL',
  ];

  validate(): EnvValidationReport {
    const results: EnvValidationResult[] = [];
    const missing: string[] = [];

    for (const key of this.REQUIRED_VARS) {
      const value = process.env[key];
      const present = !!value;
      if (!present) missing.push(key);
      results.push({
        variable: key,
        present,
        valid: present,
        message: present ? 'Configured' : 'MISSING — required for startup',
      });
    }

    for (const key of this.OPTIONAL_VARS) {
      const value = process.env[key];
      results.push({
        variable: key,
        present: !!value,
        valid: true,
        message: value ? 'Configured' : 'Not configured (optional)',
      });
    }

    this.logger.log(`Env validation: ${results.length} vars checked, ${missing.length} missing`);
    return { timestamp: new Date(), results, passed: missing.length === 0, missing };
  }
}
