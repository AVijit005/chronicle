import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: true,
  });

  const config = app.get(ConfigService);
  const logger = app.get(Logger);
  app.useLogger(logger);

  app.setGlobalPrefix(config.get<string>('apiPrefix') ?? 'api');

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = (req.get('x-request-id') ?? randomUUID()) as string;
    req.id = requestId;
    res.setHeader('x-request-id', requestId);
    next();
  });
  app.enableCors({
    origin: process.env.CORS_ORIGIN || false,
    credentials: true,
  });

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const swaggerEnabled = config.get<boolean | undefined>('swagger.enabled') !== false;
  const swaggerPath = config.get<string>('swagger.path') ?? 'docs';

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(config.get<string>('swagger.title') ?? 'Chronicle API')
      .setDescription(config.get<string>('swagger.description') ?? '')
      .setVersion(config.get<string>('swagger.version') ?? '0.0.1')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, document);
  }

  app.enableShutdownHooks();

  return app;
}
