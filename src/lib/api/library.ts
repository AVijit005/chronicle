import { apiGet, apiPost, apiPatch, apiDelete } from './fetch';
import { MEDIA, type MediaItem } from '@/lib/mock';

function mockLibraryItems(): LibraryItemResponse[] {
  return MEDIA.map((m: MediaItem) => ({
    id: m.id,
    status: m.status ?? 'planned',
    rating: m.rating ?? null,
    rewatchCount: m.rewatchCount ?? null,
    favorite: m.favorite ?? false,
    hidden: false,
    private: false,
    notes: m.synopsis ?? null,
    startedAt: null,
    finishedAt: null,
    lastInteractionAt: null,
    progress: m.progress ?? null,
    progressPercentage: m.progress ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mediaType: m.kind,
    media: {
      id: m.id,
      slug: m.id,
      title: m.title,
      posterUrl: m.poster,
      backdropUrl: m.backdrop ?? null,
      releaseYear: m.year,
      genres: m.genres,
    }
  }));
}export interface LibraryItemMedia {
  id: string;
  slug: string;
  title: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseYear: number | null;
  genres: string[];
}

export interface LibraryItemResponse {
  id: string;
  status: string;
  rating: number | null;
  rewatchCount: number | null;
  favorite: boolean;
  hidden: boolean;
  private: boolean;
  notes: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  lastInteractionAt: string | null;
  progress: number | null;
  progressPercentage: number | null;
  createdAt: string;
  updatedAt: string;
  mediaType: string;
  media: LibraryItemMedia | null;
}

export interface LibraryListResponse {
  data: LibraryItemResponse[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface LibraryStatsResponse {
  total: number;
  byStatus: Record<string, number>;
  byMediaType: Record<string, number>;
  averageRating: number | null;
  favoriteCount: number;
}

export interface AddToLibraryInput {
  mediaType: string;
  mediaId: string;
  status?: string;
}

export interface UpdateLibraryItemInput {
  status?: string;
  rating?: number;
  favorite?: boolean;
  hidden?: boolean;
  private?: boolean;
  notes?: string;
  startedAt?: string;
  finishedAt?: string;
  progress?: number;
  rewatchCount?: number;
}

export interface LibraryFilterParams {
  [key: string]: any;
  status?: string;
  mediaType?: string;
  favorite?: boolean;
  hidden?: boolean;
  private?: boolean;
  cursor?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export async function addToLibrary(input: AddToLibraryInput): Promise<LibraryItemResponse> {
  return apiPost<LibraryItemResponse>('/library', input);
}

export async function listLibrary(params?: LibraryFilterParams): Promise<LibraryListResponse> {
  try {
    return await apiGet<LibraryListResponse>(`/library${buildQueryString(params ?? {})}`);
  } catch (e) {
    return { data: mockLibraryItems(), hasMore: false };
  }
}

export async function listLibraryByStatus(status: string, params?: LibraryFilterParams): Promise<LibraryListResponse> {
  try {
    return await apiGet<LibraryListResponse>(`/library/status/${status}${buildQueryString(params ?? {})}`);
  } catch (e) {
    return { data: mockLibraryItems().filter(m => m.status === status), hasMore: false };
  }
}

export async function listLibraryByType(type: string, params?: LibraryFilterParams): Promise<LibraryListResponse> {
  try {
    return await apiGet<LibraryListResponse>(`/library/type/${type}${buildQueryString(params ?? {})}`);
  } catch (e) {
    return { data: mockLibraryItems().filter(m => m.mediaType === type), hasMore: false };
  }
}

export async function getLibraryStats(): Promise<LibraryStatsResponse> {
  return apiGet<LibraryStatsResponse>('/library/stats');
}

export async function getLibraryItem(id: string): Promise<LibraryItemResponse> {
  return apiGet<LibraryItemResponse>(`/library/${id}`);
}

export async function updateLibraryItem(id: string, input: UpdateLibraryItemInput): Promise<LibraryItemResponse> {
  return apiPatch<LibraryItemResponse>(`/library/${id}`, input);
}

export async function removeFromLibrary(id: string): Promise<void> {
  return apiDelete(`/library/${id}`);
}
