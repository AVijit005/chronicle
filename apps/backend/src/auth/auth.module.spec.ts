import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { EMAIL_TRANSPORT, ResendEmailTransportService, ConsoleEmailTransportService } from './services';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedModule } from '../shared';

jest.mock('../prisma/prisma.module', () => ({
  PrismaModule: class {}
}));

describe('AuthModule', () => {
  it('should use ConsoleEmailTransportService when nodeEnv is development', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
    .overrideProvider(ConfigService)
    .useValue({ get: (key) => key === 'nodeEnv' ? 'development' : null })
    .compile();

    const transport = module.get(EMAIL_TRANSPORT);
    expect(transport).toBeInstanceOf(ConsoleEmailTransportService);
  });

  it('should use ResendEmailTransportService when nodeEnv is production', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
    .overrideProvider(ConfigService)
    .useValue({ get: (key) => key === 'nodeEnv' ? 'production' : null })
    .compile();

    const transport = module.get(EMAIL_TRANSPORT);
    expect(transport).toBeInstanceOf(ResendEmailTransportService);
  });
});
