import { IsBoolean, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsString()
  @IsIn(['home', 'library', 'timeline', 'dashboard'])
  defaultLandingPage?: 'home' | 'library' | 'timeline' | 'dashboard';

  @IsOptional()
  @IsString()
  @IsIn(['grid', 'list'])
  gridListPreference?: 'grid' | 'list';

  @IsOptional()
  @IsBoolean()
  autoplay?: boolean;

  @IsOptional()
  @IsBoolean()
  reduceMotion?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['card', 'compact', 'poster'])
  preferredMediaView?: 'card' | 'compact' | 'poster';

  @IsOptional()
  @IsString()
  @IsIn(['recent', 'title', 'rating', 'releaseDate'])
  defaultSort?: 'recent' | 'title' | 'rating' | 'releaseDate';

  @IsOptional()
  @IsObject()
  defaultFilters?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @IsIn(['all', 'inProgress', 'completed', 'favorites'])
  defaultLibraryView?: 'all' | 'inProgress' | 'completed' | 'favorites';
}
