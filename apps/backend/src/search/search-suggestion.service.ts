import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';
import type { SuggestionDto, SuggestionsResponseDto } from './dto';

@Injectable()
export class SearchSuggestionService {
  constructor(private readonly repository: SearchRepository) {}

  async getSuggestions(userId: string, q: string, limit = 8): Promise<SuggestionsResponseDto> {
    const [prefixSuggestions, recent] = await Promise.all([
      this.repository.getPrefixSuggestions(q, userId, limit),
      this.repository.getRecentSearches(userId, 5),
    ]);

    const suggestions: SuggestionDto[] = prefixSuggestions.map((s) => ({
      text: s.text,
      type: s.type,
      score: s.score,
    }));

    return { suggestions, recent };
  }

  async getRecentSearches(userId: string, limit = 10): Promise<string[]> {
    return this.repository.getRecentSearches(userId, limit);
  }

  async clearHistory(userId: string): Promise<void> {
    return this.repository.clearSearchHistory(userId);
  }
}
