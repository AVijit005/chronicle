import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { createApp } from '../src/app.bootstrap';

describe('Application (e2e)', () => {
  let app: Awaited<ReturnType<typeof createApp>>;
  let baseUrl: string;

  beforeAll(async () => {
    app = await createApp();
    await app.listen(0);
    baseUrl = await app.getUrl();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/health responds', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
    const body = await response.text();
    expect(body.length).toBeGreaterThan(0);
  });

  it('/docs serves Swagger HTML', async () => {
    const response = await fetch(`${baseUrl}/docs`);
    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toContain('Swagger UI');
  });

  it('/docs-json serves OpenAPI spec', async () => {
    const response = await fetch(`${baseUrl}/docs-json`);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.openapi).toBeDefined();
  });
});
