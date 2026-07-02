import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { SharedModule } from '../shared';
import { AnalyticsModule } from '../analytics';
import { WrappedController } from './wrapped.controller';
import { WrappedService } from './wrapped.service';
import { WrappedRepository } from './wrapped.repository';
import { WrappedGeneratorService } from './wrapped-generator.service';
import { WrappedShareService } from './wrapped-share.service';
import { WrappedInsightsService } from './wrapped-insights.service';

@Module({
  imports: [SharedModule, AuthModule, AnalyticsModule],
  controllers: [WrappedController],
  providers: [WrappedService, WrappedRepository, WrappedGeneratorService, WrappedShareService, WrappedInsightsService],
  exports: [WrappedService],
})
export class WrappedModule {}
