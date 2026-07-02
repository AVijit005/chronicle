import { ConfigService } from '@nestjs/config';
import { createApp } from './app.bootstrap';

async function bootstrap(): Promise<void> {
  const app = await createApp();
  const config = app.get(ConfigService);
  const logger = app.get('Logger');

  const port = config.get<number>('port') ?? 3000;
  await app.listen(port, '0.0.0.0');

  logger.log(`Application listening on port ${port}`);
  logger.log(
    `Swagger available at /${config.get<string>('swagger.path') ?? 'docs'} (global API prefix is /${config.get<string>('apiPrefix') ?? 'api'})`,
  );
  logger.log(`Environment: ${config.get<string>('nodeEnv')}`);
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to start application', error);
  process.exit(1);
});
