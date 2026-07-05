/**
 * Notifications adapter: API responses → UINotification
 */

import type { UINotification } from "./types";
import type { NotificationResponse } from "@/lib/api/notifications";

export function adaptNotification(n: NotificationResponse): UINotification {
  return {
    id: n.id,
    title: n.title,
    body: n.body,
    type: n.type,
    isRead: n.isRead,
    actionUrl: n.actionUrl,
    createdAt: n.createdAt,
  };
}
