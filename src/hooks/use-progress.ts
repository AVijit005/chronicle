import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressApi } from '@/lib/api';
import { queryKeys } from '@/lib/api/query-keys';
import type { UpdateProgressInput } from '@/lib/api/progress';

export function useProgress(libraryId: string) {
  return useQuery({
    queryKey: queryKeys.progress.detail(libraryId),
    queryFn: () => progressApi.getProgress(libraryId),
    enabled: !!libraryId,
  });
}

export function useRecentProgress() {
  return useQuery({
    queryKey: queryKeys.progress.recent(),
    queryFn: () => progressApi.getRecentProgress(),
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ libraryId, input }: { libraryId: string; input: UpdateProgressInput }) =>
      progressApi.updateProgress(libraryId, input),
    onSuccess: (_data, { libraryId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.detail(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.library.detail(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.library.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.recent() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useCompleteProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (libraryId: string) => progressApi.completeProgress(libraryId),
    onSuccess: (_data, libraryId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.detail(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.library.detail(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.library.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wrapped.all });
    },
  });
}

export function useResetProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (libraryId: string) => progressApi.resetProgress(libraryId),
    onSuccess: (_data, libraryId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.detail(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.library.detail(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.library.all });
    },
  });
}
