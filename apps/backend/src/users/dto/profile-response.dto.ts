export class ProfileResponseDto {
  id: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  displayName: string | null;
  username: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  timezone: string | null;
  language: string | null;
  dateFormat: string | null;
  themePreference: string | null;
  avatar: string | null;
  coverImage: string | null;
  preferences: Record<string, unknown> | null;
  privacy: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}
