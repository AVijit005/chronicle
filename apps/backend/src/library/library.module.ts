import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { SharedModule } from '../shared';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { LibraryRepository } from './library.repository';
import { LibraryStatisticsService } from './library-statistics.service';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [LibraryController],
  providers: [LibraryService, LibraryRepository, LibraryStatisticsService],
  exports: [LibraryService, LibraryRepository, LibraryStatisticsService],
})
export class LibraryModule {}
