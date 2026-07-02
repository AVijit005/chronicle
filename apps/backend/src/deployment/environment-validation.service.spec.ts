import { describe, it, expect, beforeEach } from 'bun:test';
import { EnvironmentValidationService } from './environment-validation.service';

describe('EnvironmentValidationService', () => {
  let service: EnvironmentValidationService;

  beforeEach(() => {
    service = new EnvironmentValidationService();
  });

  it('validates environment variables', () => {
    const report = service.validate();
    expect(report.timestamp).toBeDefined();
    expect(report.results.length).toBeGreaterThan(0);
  });

  it('checks required variables', () => {
    const report = service.validate();
    const required = report.results.filter((r) => r.variable === 'DATABASE_URL' || r.variable === 'JWT_ACCESS_SECRET');
    expect(required.length).toBeGreaterThanOrEqual(2);
  });

  it('returns passed status', () => {
    const report = service.validate();
    expect(typeof report.passed).toBe('boolean');
  });

  it('lists missing variables', () => {
    const report = service.validate();
    expect(Array.isArray(report.missing)).toBe(true);
  });
});
