import { DomainEvent } from '../core';

export interface UserPreferences {
  defaultLandingPage?: 'home' | 'library' | 'timeline' | 'dashboard';
  gridListPreference?: 'grid' | 'list';
  autoplay?: boolean;
  reduceMotion?: boolean;
  preferredMediaView?: 'card' | 'compact' | 'poster';
  defaultSort?: 'recent' | 'title' | 'rating' | 'releaseDate';
  defaultFilters?: Record<string, unknown>;
  defaultLibraryView?: 'all' | 'inProgress' | 'completed' | 'favorites';
}

export type PrivacyVisibility = 'public' | 'followers' | 'private';

export interface UserPrivacy {
  profileVisibility?: PrivacyVisibility;
  collectionVisibility?: PrivacyVisibility;
  journalVisibility?: PrivacyVisibility;
  timelineVisibility?: PrivacyVisibility;
  wrappedVisibility?: PrivacyVisibility;
  searchVisibility?: PrivacyVisibility;
}

export interface ParsedUserAgent {
  browser?: string;
  os?: string;
}

export class UserProfileUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly changes: Record<string, unknown>,
    public readonly metadata?: Record<string, unknown>,
  ) {
    super(aggregateId);
  }
}

export class UserPreferencesUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly preferences: UserPreferences,
    public readonly metadata?: Record<string, unknown>,
  ) {
    super(aggregateId);
  }
}

export class UserPrivacyUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly privacy: UserPrivacy,
    public readonly metadata?: Record<string, unknown>,
  ) {
    super(aggregateId);
  }
}

export class UserAvatarUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly avatarPath: string | null,
    public readonly metadata?: Record<string, unknown>,
  ) {
    super(aggregateId);
  }
}
