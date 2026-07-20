import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { createApp } from './app.bootstrap';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      get: jest.fn().mockImplementation((token) => {
        if (token === ConfigService) {
          return {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'swagger.enabled') return true;
              if (key === 'nodeEnv') return process.env.NODE_ENV_TEST;
              if (key === 'apiPrefix') return 'api';
              return undefined;
            })
          };
        }
        return { info: jest.fn(), error: jest.fn(), warn: jest.fn() };
      }),
      useLogger: jest.fn(),
      setGlobalPrefix: jest.fn(),
      getHttpAdapter: jest.fn().mockReturnValue({ getInstance: jest.fn().mockReturnValue({ set: jest.fn() }) }),
      use: jest.fn(),
      enableCors: jest.fn(),
      useGlobalInterceptors: jest.fn(),
      enableShutdownHooks: jest.fn(),
    })
  }
}));

jest.mock('@nestjs/swagger', () => ({
  SwaggerModule: {
    createDocument: jest.fn(),
    setup: jest.fn(),
  },
  DocumentBuilder: class {
    setTitle() { return this; }
    setDescription() { return this; }
    setVersion() { return this; }
    build() { return {}; }
  }
}));

describe('app.bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should disable Swagger in production even if swagger.enabled is true', async () => {
    process.env.NODE_ENV_TEST = 'production';
    await createApp();
    expect(SwaggerModule.setup).not.toHaveBeenCalled();
  });

  it('should enable Swagger in development if swagger.enabled is true', async () => {
    process.env.NODE_ENV_TEST = 'development';
    await createApp();
    expect(SwaggerModule.setup).toHaveBeenCalled();
  });
});
