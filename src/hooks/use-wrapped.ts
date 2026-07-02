import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wrappedApi } from '@/lib/api';
import { queryKeys } from '@/lib/api/query-keys';

export function useWrappedList() {
  return useQuery({
    queryKey: queryKeys.wrapped.list(),
    queryFn: () => wrappedApi.listWrapped(),
    staleTime: 5 * 60_000,
  });
}

export function useWrapped(year: number) {
  return useQuery({
    queryKey: queryKeys.wrapped.detail(year),
    queryFn: () => wrappedApi.getWrapped(year),
    enabled: !!year,
  });
}

export function useWrappedShare(year: number) {
  return useQuery({
    queryKey: queryKeys.wrapped.share(year),
    queryFn: () => wrappedApi.getWrappedShare(year),
    enabled: !!year,
  });
}

export function useWrappedSummary(year: number) {
  return useQuery({
    queryKey: queryKeys.wrapped.summary(year),
    queryFn: () => wrappedApi.getWrappedSummary(year),
    enabled: !!year,
  });
}

export function useGenerateWrapped() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (year: number) => wrappedApi.generateWrapped(year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wrapped.all });
    },
  });
}

export function useRegenerateWrapped() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (year: number) => wrappedApi.regenerateWrapped(year),
    onSuccess: (_data, year) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wrapped.detail(year) });
      queryClient.invalidateQueries({ queryKey: queryKeys.wrapped.all });
    },
  });
}

export function useDeleteWrapped() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (year: number) => wrappedApi.deleteWrapped(year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wrapped.all });
    },
  });
}
