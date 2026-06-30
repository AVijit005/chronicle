// Product audit — deterministic checks against the mock graph.
import { MEDIA, COLLECTIONS, JOURNAL } from "@/lib/mock";
import { MEMORIES_BY_MEDIA } from "@/lib/memory";

export interface AuditFinding {
  severity: "info" | "warn" | "error";
  area: string;
  message: string;
}

export function runProductAudit(): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const ids = new Set<string>();
  for (const m of MEDIA) {
    if (ids.has(m.id))
      findings.push({ severity: "error", area: "media", message: `Duplicate media id: ${m.id}` });
    ids.add(m.id);
    if (!m.poster)
      findings.push({ severity: "warn", area: "media", message: `Missing poster: ${m.id}` });
  }
  for (const c of COLLECTIONS) {
    for (const id of c.mediaIds ?? []) {
      if (!MEDIA.find((m) => m.id === id))
        findings.push({
          severity: "warn",
          area: "collection",
          message: `${c.id} references missing media ${id}`,
        });
    }
    if ((c.mediaIds ?? []).length === 0)
      findings.push({ severity: "info", area: "collection", message: `${c.id} is empty` });
  }
  for (const m of MEDIA) {
    if (!MEMORIES_BY_MEDIA[m.id])
      findings.push({ severity: "info", area: "memory", message: `No memory for ${m.id}` });
  }
  if (!JOURNAL.length)
    findings.push({ severity: "warn", area: "journal", message: "No journal entries" });
  return findings;
}
