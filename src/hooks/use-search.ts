import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchApi } from '@/lib/api';
import { queryKeys } from '@/lib/api/query-keys';
import type { SearchParams } from '@/lib/api/search';

export function useSearch(params: SearchParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.search.query(params),
    queryFn: () => searchApi.search(params),
    enabled: enabled && !!params.q && params.q.length > 0,
    staleTime: 0,
  });
}

export function useSearchSuggestions(q: string) {
  return useQuery({
    queryKey: queryKeys.search.suggestions(q),
    queryFn: () => searchApi.getSuggestions(q),
    enabled: !!q && q.length >= 2,
    staleTime: 10_000,
  });
}

export function useRecentSearches() {
  return useQuery({
    queryKey: queryKeys.search.recent(),
    queryFn: () => searchApi.getRecentSearches(),
  });
}

export function useClearRecentSearches() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => searchApi.clearRecentSearches(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.search.recent() });
    },
  });
}

export function useTrending() {
  return useQuery({
    queryKey: queryKeys.search.trending(),
    queryFn: () => searchApi.getTrending(),
    staleTime: 5 * 60_000,
  });
}

export function useFilterOptions() {
  return useQuery({
    queryKey: queryKeys.search.filterOptions(),
    queryFn: () => searchApi.getFilterOptions(),
    staleTime: 10 * 60_000,
  });
}
