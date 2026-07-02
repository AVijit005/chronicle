# Phase 06D User Domain Plan Verdict

**Plan file:** `/mnt/d/chronicle-your-media-story-mainzipzip/.kimchi/docs/superpowers/plans/2026-07-01-phase06d-user-domain-plan.md`

**Verdict:** NEEDS_REVISION

---

## Build Feasibility Check

The plan is **not detailed enough for a standard-tier Builder to implement without inventing design decisions**.

While the high-level modules, endpoints, service names, and DTO field lists are present, several critical implementation details are either missing or inconsistent with the existing codebase. A Builder following this plan literally would hit compile-time or runtime mismatches, particularly around storage and session integration. The missing validation rules (regexes, enum membership lists, JSON shapes) force the Builder to make product decisions that should have been specified in the plan.

Method signatures are mostly explicit for the orchestrator service, but lower-level contracts (e.g., `StorageService.upload`, session token comparison, file validation pipe) are not aligned with existing abstractions.

---

## Complexity Accuracy Check

All chunks are classified as **simple**. This is broadly accurate:

- No chunk involves concurrency primitives, distributed locking, algorithmic complexity, or state machines.
- The work is mostly CRUD with validation, file I/O, and test coverage.

However, **Chunk 3** (DTOs, repository, audit helper, types) and **Chunk 5** (orchestrator service, controller, module wiring, AppModule import) combine multiple independent concerns. They remain simple in algorithmic terms, but their scope is large enough that a single chunk could exceed a standard build iteration. This is a scope concern, not a complexity misclassification.

---

## Chunk Scope Check

- **Chunk 3 — Users DTOs, repository, and audit helper:** combines presentation-layer DTOs, persistence-layer repository, a cross-cutting audit service, and domain types. These are four independent concerns. The DTOs and types alone could be one chunk; the repository and audit helper each another.
- **Chunk 5 — Orchestrator service and controller:** combines service orchestration, HTTP controller routes, NestJS module registration, and application-root module wiring. The controller/module wiring is independent of the service logic and could be split.

The chunks are implementable, but they violate the guideline of keeping chunks focused on a single concern.

---

## Requirement Coverage Check

The original task requirements are **addressed at a headline level**, but several are not clearly specified:

| Requirement | Coverage | Gap |
|-------------|----------|-----|
| Modules/Services list | Covered | — |
| Endpoints list | Covered | — |
| Profile fields | Covered in schema/DTO | — |
| Preferences fields | Listed | No enum/JSON shape for values |
| Privacy fields | Listed | Visibility enum values given, but no JSON shape |
| Avatar upload/replacement/deletion/validation | Covered | Storage interface mismatch |
| Sessions list/revoke, current device, last seen, IP, browser, OS | Partially covered | `lastSeen` field source undefined; token comparison incorrectly specifies hashing |
| Validation rules | Partially covered | Regexes and enum values missing |
| Security/ownership/auditing | Covered | — |
| SharedModule/BaseRepository/Result/RequestContext/Correlation ID/domain events | Partially covered | Correlation ID and domain events usage not specified |
| Tests | Covered | — |
| Verify commands | Covered | — |
| Do not redesign auth/session/JWT; do not modify Prisma schema unless absolutely necessary | Partially covered | Prisma schema is modified with 13 new fields; session integration description contradicts existing `Session.token` storage |

---

## Specific Gaps and Issues

1. **StorageService interface mismatch in Chunk 2**
   - **File/Chunk:** `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend/src/core/storage/storage.abstraction.ts` (existing), Chunk 2
   - **Line reference:** existing interface defines `upload(path: string, file: StorageFile): Promise<string>`
   - **Problem:** The plan instructs the Builder to implement `LocalStorageService.upload(basePath, file)` and write to `{UPLOAD_ROOT}/{basePath}/{uuid}.{ext}`. The existing `StorageService` contract expects the caller to supply the full destination path and returns the stored path. Implementing the plan literally would break the interface contract.
   - **Suggested fix:** Change the plan to define `upload(path: string, file: StorageFile)` and move path generation (including UUID and extension) into the caller (`AvatarService`). `LocalStorageService` should write exactly to `{UPLOAD_ROOT}/{path}` and return the relative path.

2. **Session token comparison incorrectly specifies hashing**
   - **File/Chunk:** `/mnt/d/chronicle-your-media-story-mainzipzip/prisma/schema.prisma` (existing `Session.token`), Chunk 5 "Ownership & Session Integration Notes"
   - **Line reference:** `Session.token` is stored as plain text (`String @unique @db.Text`); existing `SessionService.validate(token)` compares the raw token.
   - **Problem:** The plan says `listSessions` receives the `refresh_token` cookie, "hashes it, and compares it to each session's stored token." Because `Session.token` stores the token in plain text, hashing the cookie would never match. This would cause the "current device" marker to fail.
   - **Suggested fix:** Either compare the raw cookie value to `Session.token` (matching existing `SessionService.validate`), or explicitly require adding a `tokenHash` column to `Session` and updating the auth flow.

3. **`lastSeen` field source undefined for sessions**
   - **File/Chunk:** `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend/src/users/dto/session-response.dto.ts` (planned), Chunk 3
   - **Problem:** The planned `SessionResponseDto` includes `lastSeen`, but the `Session` model has no `lastSeen` field. The plan does not say whether to map `lastSeen` to `createdAt`, `updatedAt`, or add a new column.
   - **Suggested fix:** Explicitly state the mapping (e.g., `lastSeen = session.updatedAt`) or add a `lastSeen DateTime? @map("last_seen")` column to `Session` in the schema changes.

4. **Soft-delete semantics for session revoke are ambiguous**
   - **File/Chunk:** Chunk 3 (`revokeSession`), Chunk 5 "Ownership & Session Integration Notes"
   - **Problem:** The repository says "soft-delete + status REVOKED," but the existing `SessionService.invalidateByToken` only sets `status = REVOKED` and never populates `deletedAt`. The plan does not clarify whether `revokeSession` should set `deletedAt`, status, or both, and whether the auth module's behavior needs to align.
   - **Suggested fix:** Specify exact Prisma data: `{ status: 'REVOKED', deletedAt: new Date() }` if soft delete is intended, or `{ status: 'REVOKED' }` if matching existing auth behavior. If both are set, the existing `SessionService.validate` already checks `deletedAt`, so revocation would work consistently.

5. **Username uniqueness check does not exclude the current user**
   - **File/Chunk:** Chunk 4 (`ProfileService`)
   - **Problem:** The plan says "Check username uniqueness via `UsersRepository.findByUsername`." If a user submits a `PATCH /api/users/me` with their own unchanged username, the naive uniqueness check would return a conflict.
   - **Suggested fix:** Specify that the uniqueness check must exclude the current user's own record (e.g., `where: { username, NOT: { id: userId } }`).

6. **Validation rules are incomplete**
   - **File/Chunk:** Chunk 3 (DTOs), Chunk 4 (services)
   - **Missing details:**
     - Username regex/pattern (only length 3-30 is given).
     - Timezone regex or allowed timezone list.
     - Language ISO-639-1 regex or allowed language list.
     - `dateFormat` enum values (e.g., `MM/DD/YYYY`, `DD/MM/YYYY`, `YYYY-MM-DD`).
     - `themePreference` enum values (e.g., `light`, `dark`, `system`).
     - `defaultLandingPage` allowed values.
     - `gridListPreference` allowed values.
     - `preferredMediaView` allowed values.
     - `defaultSort` allowed values.
     - `defaultFilters` shape/type (JSON object? array? string?).
     - `defaultLibraryView` allowed values.
     - Website URL validation rules (is protocol required? allowed schemes?).
   - **Suggested fix:** Add a "Validation Rules" subsection to the plan with explicit regexes, enums, and JSON schemas so the Builder does not invent business rules.

7. **Avatar controller file validation is underspecified**
   - **File/Chunk:** Chunk 5 (`UsersController`)
   - **Problem:** The plan writes `@UploadedFile(...validated...) file`. It does not specify whether to use a NestJS `ParseFilePipe`/`MaxFileSizeValidator`/`FileTypeValidator`, or a custom validation pipe, or service-layer validation.
   - **Suggested fix:** Replace the placeholder with an explicit pipe, e.g., `ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), new FileTypeValidator({ fileType: /\.(jpg|jpeg|png|webp)$/ })] })`, plus note that MIME type is re-validated in `AvatarService`.

8. **Correlation ID and domain events usage not specified**
   - **File/Chunk:** Chunk 4, Chunk 5
   - **Problem:** The original task requires use of "RequestContext, Correlation ID, domain events where appropriate." The plan mentions `RequestContextService` in constraints but never specifies where the correlation ID is read, propagated to audit logs, or used in responses. Domain events are not mentioned at all.
   - **Suggested fix:** Add explicit instructions, for example: include `correlationId` in `AuditLog.metadata` via `RequestContextService.getCorrelationId()`; emit a `UserProfileUpdatedEvent` from `ProfileService` after a successful update.

9. **Prisma schema modification scope vs. constraint**
   - **File/Chunk:** Chunk 1
   - **Problem:** The original task says "do not modify Prisma schema unless absolutely necessary." The plan modifies `User` with 13 new fields. While this is a reasonable design choice, the plan does not justify why 13 new columns are "absolutely necessary" rather than storing some fields (e.g., preferences, privacy, theme) in JSON columns.
   - **Suggested fix:** Add a one-line rationale for the schema change, or explicitly state that the task's profile/privacy requirements require persisted typed columns.

10. **Chunk 3 combines too many independent concerns**
    - **File/Chunk:** Chunk 3
    - **Problem:** DTOs, repository, audit helper, and types are bundled together. A failure in any one area blocks the whole chunk.
    - **Suggested fix:** Split into at least two chunks: one for DTOs/types, and one for repository/audit helper.

---

## Summary

The plan correctly captures the breadth of Phase 06D and names all required services, endpoints, and tests. However, it contains concrete technical conflicts with the existing codebase (`StorageService` signature, session token comparison), omits critical validation details, and leaves session field mapping ambiguous. It should be revised before implementation begins.
