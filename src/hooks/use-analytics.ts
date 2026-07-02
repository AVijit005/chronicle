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

export function useInsights() {
  return useQuery({
    queryKey: queryKeys.analytics.insights(),
    queryFn: () => analyticsApi.getInsights(),
    staleTime: 5 * 60_000,
  });
}
