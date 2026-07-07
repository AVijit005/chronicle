import { apiGet } from './fetch';
import { MEDIA } from '../mock';

export interface MediaResponse {
  id: string;
  slug: string;
  title: string;
  originalTitle: string | null;
  description: string | null;
  overview: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  bannerUrl: string | null;
  coverImage: string | null;
  thumbnail: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  runtime: number | null;
  duration: number | null;
  language: string | null;
  country: string | null;
  genres: string[];
  tags: string[];
  externalIds: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  status: string;
  mediaType: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaListResponse {
  data: MediaResponse[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface MediaSearchParams {
  [key: string]: any;
  search: string;
  mediaType?: string;
  genre?: string;
  language?: string;
  country?: string;
  releaseYear?: string;
  status?: string;
  cursor?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MediaFilterParams {
  [key: string]: any;
  mediaType?: string;
  genre?: string;
  language?: string;
  country?: string;
  releaseYear?: string;
  status?: string;
  cursor?: string;
  limit?: number;
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

export async function listMedia(params?: MediaFilterParams): Promise<MediaListResponse> {
  return apiGet<MediaListResponse>(`/media${buildQueryString(params ?? {})}`);
}

export async function searchMedia(params: MediaSearchParams): Promise<MediaListResponse> {
  return apiGet<MediaListResponse>(`/media/search${buildQueryString(params)}`);
}

export async function listMediaByType(type: string, params?: MediaFilterParams): Promise<MediaListResponse> {
  return apiGet<MediaListResponse>(`/media/type/${type}${buildQueryString(params ?? {})}`);
}

function toMediaResponse(mock: any): MediaResponse {
  return {
    id: mock.id,
    slug: mock.slug || mock.id,
    title: mock.title,
    originalTitle: mock.title,
    description: mock.synopsis,
    overview: mock.synopsis,
    posterUrl: mock.poster,
    backdropUrl: mock.backdrop || null,
    bannerUrl: mock.backdrop || null,
    coverImage: mock.poster,
    thumbnail: mock.poster,
    releaseDate: `${mock.year}-01-01`,
    releaseYear: mock.year,
    runtime: mock.runtime ? parseInt(mock.runtime) * 60 : null,
    duration: null,
    language: "en",
    country: "US",
    genres: mock.genres || [],
    tags: [],
    externalIds: null,
    metadata: null,
    status: "Released",
    mediaType: mock.kind || "movie",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export async function getMedia(id: string): Promise<MediaResponse> {
  try {
    return await apiGet<MediaResponse>(`/media/${id}`);
  } catch (error) {
    const mock = MEDIA.find((m) => m.id === id);
    if (!mock) throw error;
    return toMediaResponse(mock);
  }
}

export async function getRelatedMedia(id: string): Promise<MediaResponse[]> {
  try {
    return await apiGet<MediaResponse[]>(`/media/${id}/related`);
  } catch (error) {
    const mock = MEDIA.find((m) => m.id === id);
    if (mock && mock.mediaIds) {
      return mock.mediaIds.map((mid: string) => {
        const m = MEDIA.find((x) => x.id === mid);
        return m ? toMediaResponse(m) : null;
      }).filter(Boolean) as MediaResponse[];
    }
    return MEDIA.slice(0, 4).filter(m => m.id !== id).map(toMediaResponse);
  }
}

export async function getMediaMetadata(id: string): Promise<Record<string, unknown>> {
  try {
    return await apiGet<Record<string, unknown>>(`/media/${id}/metadata`);
  } catch (error) {
    return {};
  }
}
