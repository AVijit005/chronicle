import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { SharedModule } from '../shared';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchRepository } from './search.repository';
import { SearchSuggestionService } from './search-suggestion.service';
import { SearchStatisticsService } from './search-statistics.service';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [SearchController],
  providers: [SearchService, SearchRepository, SearchSuggestionService, SearchStatisticsService],
  exports: [SearchService],
})
export class SearchModule {}
