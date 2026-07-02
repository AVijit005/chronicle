import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { SharedModule } from '../shared';
import { InteractionController } from './interaction.controller';
import { InteractionService } from './interaction.service';
import { InteractionRepository } from './interaction.repository';
import { InteractionEventService } from './interaction-event.service';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [InteractionController],
  providers: [InteractionService, InteractionRepository, InteractionEventService],
  exports: [InteractionService, InteractionRepository, InteractionEventService],
})
export class InteractionModule {}
