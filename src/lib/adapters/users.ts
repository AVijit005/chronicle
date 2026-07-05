/**
 * Users adapter: API responses → UIProfile
 */

import type { UIProfile } from "./types";
import type { ProfileResponse } from "@/lib/api/users";

export function adaptProfile(p: ProfileResponse): UIProfile {
  return {
    id: p.id,
    email: p.email,
    displayName: p.displayName,
    username: p.username,
    bio: p.bio,
    avatar: p.avatar,
    coverImage: p.coverImage,
    timezone: p.timezone,
    themePreference: p.themePreference,
    createdAt: p.createdAt,
  };
}
