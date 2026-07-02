export class MediaResponseDto {
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
