import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { queryKeys } from '@/lib/api/query-keys';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: () => analyticsApi.getDashboard(),
    staleTime: 2 * 60_000,
  });
}

export function useOverview() {
  return useQuery({
    queryKey: queryKeys.analytics.overview(),
    queryFn: () => analyticsApi.getOverview(),
    staleTime: 5 * 60_000,
  });
}

export function useStreaks() {
  return useQuery({
    queryKey: queryKeys.analytics.streaks(),
    queryFn: () => analyticsApi.getStreaks(),
    staleTime: 5 * 60_000,
  });
}

export function useMediaAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.media(),
    queryFn: () => analyticsApi.getMediaAnalytics(),
    staleTime: 5 * 60_000,
  });
}

export function useGenreAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.genres(),
    queryFn: () => analyticsApi.getGenreAnalytics(),
    staleTime: 5 * 60_000,
  });
}

export function useActivity() {
  return useQuery({
    queryKey: queryKeys.analytics.activity(),
    queryFn: () => analyticsApi.getActivity(),
    staleTime: 5 * 60_000,
  });
}

export function useCalendar(year?: number, month?: number) {
  return useQuery({
    queryKey: queryKeys.analytics.calendar(year, month),
    queryFn: () => analyticsApi.getCalendar(year, month),
    staleTime: 5 * 60_000,
  });
}

export function useCalendarYear(year: number) {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'calendar-rich', year] as const,
    queryFn: () => analyticsApi.getCalendarYear(year),
    staleTime: 5 * 60_000,
  });
}

export function useInsights() {
  return useQuery({
    queryKey: queryKeys.analytics.insights(),
    queryFn: () => analyticsApi.getInsights(),
    staleTime: 5 * 60_000,
  });
}

export function useDiscovery() {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'discovery'] as const,
    queryFn: () => analyticsApi.getDiscovery(),
    staleTime: 2 * 60_000,
  });
}

export function useChallenges() {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'challenges'] as const,
    queryFn: () => analyticsApi.getChallenges(),
    staleTime: 5 * 60_000,
  });
}

export function useIntelligence() {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'intelligence'] as const,
    queryFn: () => analyticsApi.getIntelligence(),
    staleTime: 5 * 60_000,
  });
}
