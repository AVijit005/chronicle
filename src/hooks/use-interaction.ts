import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interactionApi } from '@/lib/api';
import { queryKeys } from '@/lib/api/query-keys';
import type { CreateReviewInput, UpdateReviewInput } from '@/lib/api/interaction';

export function useRating(libraryId: string) {
  return useQuery({
    queryKey: queryKeys.interaction.rating(libraryId),
    queryFn: () => interactionApi.updateRating(libraryId, 0),
    enabled: false,
  });
}

export function useUpdateRating() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ libraryId, rating }: { libraryId: string; rating: number }) =>
      interactionApi.updateRating(libraryId, rating),
    onSuccess: (_data, { libraryId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interaction.rating(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.library.detail(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.library.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ libraryId, favorite }: { libraryId: string; favorite: boolean }) =>
      interactionApi.toggleFavorite(libraryId, favorite),
    onMutate: async ({ libraryId, favorite }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.library.detail(libraryId) });
      const previous = queryClient.getQueryData(queryKeys.library.detail(libraryId));
      queryClient.setQueryData(queryKeys.library.detail(libraryId), (old: unknown) => {
        if (!old) return old;
        return { ...(old as Record<string, unknown>), favorite };
      });
      return { previous };
    },
    onError: (_err, { libraryId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.library.detail(libraryId), context.previous);
      }
    },
    onSettled: (_data, _error, { libraryId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.library.detail(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.library.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.interaction.all });
    },
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ libraryId, bookmark }: { libraryId: string; bookmark: boolean }) =>
      interactionApi.toggleBookmark(libraryId, bookmark),
    onSuccess: (_data, { libraryId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interaction.bookmark(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.library.detail(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.interaction.bookmarks() });
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ libraryId, input }: { libraryId: string; input: CreateReviewInput }) =>
      interactionApi.createReview(libraryId, input),
    onSuccess: (_data, { libraryId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.library.detail(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.interaction.reviews() });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ libraryId, input }: { libraryId: string; input: UpdateReviewInput }) =>
      interactionApi.updateReview(libraryId, input),
    onSuccess: (_data, { libraryId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.library.detail(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.interaction.reviews() });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (libraryId: string) => interactionApi.deleteReview(libraryId),
    onSuccess: (_data, libraryId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.library.detail(libraryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.interaction.reviews() });
    },
  });
}

export function useFavorites(params?: { cursor?: string; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.interaction.favorites(params),
    queryFn: () => interactionApi.listFavorites(params),
  });
}

export function useBookmarks(params?: { cursor?: string; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.interaction.bookmarks(params),
    queryFn: () => interactionApi.listBookmarks(params),
  });
}

export function useHistory(params?: { cursor?: string; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.interaction.history(params),
    queryFn: () => interactionApi.listHistory(params),
  });
}
