import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { SharedModule } from '../shared';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { CollectionsRepository } from './collections.repository';
import { SmartCollectionService } from './smart-collection.service';
import { CollectionStatisticsService } from './collection-statistics.service';
import { CollectionEventService } from './collection-event.service';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [CollectionsController],
  providers: [
    CollectionsService,
    CollectionsRepository,
    SmartCollectionService,
    CollectionStatisticsService,
    CollectionEventService,
  ],
  exports: [CollectionsService, CollectionsRepository, SmartCollectionService],
})
export class CollectionsModule {}
