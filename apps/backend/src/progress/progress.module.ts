import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { SharedModule } from '../shared';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { ProgressRepository } from './progress.repository';
import { ProgressCalculationService } from './progress-calculation.service';
import { ProgressEventService } from './progress-event.service';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [ProgressController],
  providers: [ProgressService, ProgressRepository, ProgressCalculationService, ProgressEventService],
  exports: [ProgressService, ProgressRepository, ProgressCalculationService, ProgressEventService],
})
export class ProgressModule {}
