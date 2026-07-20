import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { journalApi } from '@/lib/api';
import { queryKeys } from '@/lib/api/query-keys';
import type { CreateJournalEntryInput, UpdateJournalEntryInput, CreateMemoryInput } from '@/lib/api/journal';
import { analytics } from '@/lib/analytics';

export function useJournalEntries(params?: { cursor?: string; limit?: number }) {
  return useInfiniteQuery({
    queryKey: queryKeys.journal.entries(params),
    queryFn: ({ pageParam }) => journalApi.listJournalEntries({ ...params, cursor: pageParam as string | undefined }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
  });
}

export function useJournalEntry(id: string) {
  return useQuery({
    queryKey: queryKeys.journal.entry(id),
    queryFn: () => journalApi.getJournalEntry(id),
    enabled: !!id,
  });
}

export function useJournalStats() {
  return useQuery({
    queryKey: queryKeys.journal.stats(),
    queryFn: () => journalApi.getJournalStats(),
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateJournalEntryInput) => journalApi.createJournalEntry(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journal.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline.all });
      
      if (!localStorage.getItem('chronicle_first_entry_tracked')) {
        analytics.track('first_entry');
        localStorage.setItem('chronicle_first_entry_tracked', 'true');
      }
    },
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateJournalEntryInput }) =>
      journalApi.updateJournalEntry(id, input),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journal.entry(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.journal.all });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => journalApi.deleteJournalEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.journal.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useMemories(params?: { cursor?: string; limit?: number }) {
  return useInfiniteQuery({
    queryKey: queryKeys.memories.list(params),
    queryFn: ({ pageParam }) => journalApi.listMemories({ ...params, cursor: pageParam as string | undefined }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
  });
}

export function useCreateMemory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMemoryInput) => journalApi.createMemory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useTimelineEvents(params?: { year?: number; month?: number }) {
  return useQuery({
    queryKey: queryKeys.timeline.events(params),
    queryFn: () => journalApi.listTimelineEvents(params),
  });
}

export function useCreateTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { type: string; title: string; description?: string; eventDate: string }) =>
      journalApi.createTimelineEvent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline.all });
    },
  });
}

export function useJournalPrompts() {
  return useQuery({
    queryKey: [...queryKeys.journal.all, 'prompts'] as const,
    queryFn: () => journalApi.getJournalPrompts(),
    staleTime: 60 * 60_000,
  });
}
