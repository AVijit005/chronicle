/**
 * Search adapter: API responses → UISearchResult
 */

import type { UISearchResult } from "./types";
import type { SearchResultItem } from "@/lib/api/search";

export function adaptSearchResult(item: SearchResultItem): UISearchResult {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    subtitle: item.subtitle,
    imageUrl: item.imageUrl,
    matchedField: item.matchedField,
    score: item.score,
  };
}
