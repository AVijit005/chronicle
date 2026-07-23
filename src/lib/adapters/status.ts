/**
 * Status adapter: Backend UserMediaStatus → Frontend UIMediaStatus
 *
 * Backend uses media-type-specific statuses:
 *   WATCHING, READING, PLAYING, LISTENING, LEARNING
 *
 * Frontend collapses these into a single "in_progress".
 */

import type { UIMediaStatus } from "./types";

const STATUS_MAP: Record<string, UIMediaStatus> = {
  PLANNING: "planning",
  WATCHING: "in_progress",
  REWATCHING: "rewatching",
  READING: "in_progress",
  PLAYING: "in_progress",
  LISTENING: "in_progress",
  LEARNING: "in_progress",
  PAUSED: "paused",
  COMPLETED: "completed",
  DROPPED: "dropped",
  ON_HOLD: "on_hold",
  ARCHIVED: "archived",
};

export function adaptStatus(backendStatus: string): UIMediaStatus {
  return STATUS_MAP[backendStatus] ?? "in_progress";
}

export function adaptStatusToBackend(uiStatus: UIMediaStatus): string {
  const REVERSE_MAP: Record<UIMediaStatus, string> = {
    in_progress: "WATCHING",
    completed: "COMPLETED",
    planning: "PLANNING",
    paused: "PAUSED",
    dropped: "DROPPED",
    rewatching: "REWATCHING",
    archived: "ARCHIVED",
    on_hold: "ON_HOLD",
  };
  return REVERSE_MAP[uiStatus] ?? "PLANNING";
}
