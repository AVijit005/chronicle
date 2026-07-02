# Phase 06D — User Domain Implementation Plan

## Objective
Implement the authenticated user profile domain under `apps/backend/src/users`, exposing `/api/users/me*` endpoints for profile, preferences, privacy, avatar, and active-session management, while reusing Phase 06B shared abstractions and Phase 06C-1 authentication.

## Constraints
- Do not redesign authentication, session architecture, or JWT flow.
- Do not modify Prisma beyond the minimal `User` model extension required for profile data.
- Use `BaseRepository`, `Result<T,E>`, business exceptions, `RequestContextService`, and `StorageService` abstraction.
- Use Bun as the runtime; all verification commands must pass.

## Schema Rationale
The task requires persisted, queryable profile data (`username` must be unique, `avatar` must be a stored path). Therefore the `User` model is extended with typed scalar fields for profile metadata. `preferences` and `privacy` are stored as optional JSON blobs because their shapes are user-controlled and change rarely; this avoids excessive schema churn while still satisfying the requirements.

## Schema Changes (minimal)
Extend `User` in both `/prisma/schema.prisma` and `/apps/backend/prisma/schema.prisma` with:

```prisma
  displayName     String?   @map("display_name")
  username        String?   @unique @map("username")
  bio             String?   @map("bio") @db.Text
  location        String?   @map("location")
  website         String?   @map("website")
  timezone        String?   @default("UTC") @map("timezone")
  language        String?   @default("en") @map("language")
  dateFormat      String?   @default("MM/DD/YYYY") @map("date_format")
  themePreference String?   @default("system") @map("theme_preference")
  avatar          String?   @map("avatar")
  coverImage      String?   @map("cover_image")
  preferences     Json?     @map("preferences")
  privacy         Json?     @map("privacy")
```

No new models are introduced. `name` is kept unchanged for backward compatibility. `Session` is not modified.

---

## Validation Rules (explicit)
| Field | Rule |
|-------|------|
| `displayName` | `@Length(1, 50)` |
| `username` | `@Length(3, 30)`, `@Matches(/^[a-z0-9_]+$/i)` after normalization; reserved names blocked: `admin`, `root`, `api`, `auth`, `system`, `support`, `login`, `logout`, `me`, `user`, `users`, `help`, `security` |
| `bio` | `@Length(0, 500)` |
| `location` | `@Length(0, 100)` |
| `website` | optional; if present must match `^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$` |
| `timezone` | must match `^[A-Za-z_]+(/[A-Za-z_-]+)?$`; allowed examples: `UTC`, `America/New_York` |
| `language` | `@Matches(/^[a-z]{2}$/)` (ISO 639-1) |
| `dateFormat` | enum: `MM/DD/YYYY`, `DD/MM/YYYY`, `YYYY-MM-DD` |
| `themePreference` | enum: `light`, `dark`, `system` |
| `coverImage` | optional URL (same regex as website) |
| **Preferences** | `defaultLandingPage`: `home`, `library`, `timeline`, `dashboard`; `gridListPreference`: `grid`, `list`; `autoplay`: boolean; `reduceMotion`: boolean; `preferredMediaView`: `card`, `compact`, `poster`; `defaultSort`: `recent`, `title`, `rating`, `releaseDate`; `defaultFilters`: `Record<string, unknown>`; `defaultLibraryView`: `all`, `inProgress`, `completed`, `favorites` |
| **Privacy** | all visibility fields enum: `public`, `followers`, `private` |
| **Avatar** | max size 2 MiB; MIME type `image/jpeg`, `image/png`, `image/webp`; file extension from original name |

---

## Chunk 1 — Schema extension & Prisma client generation
**Files:**
- `/prisma/schema.prisma`
- `/apps/backend/prisma/schema.prisma`

**Actions:**
1. Add the 13 fields above to the `User` model in both schema files, preserving formatting.
2. Run `cd /mnt/d/chronicle-your-media-story-mainzipzip/apps/backend && bunx prisma format`.
3. Run `bunx prisma generate` to update the generated Prisma Client types.

**Acceptance criteria:**
- `prisma validate` passes.
- `bun run build` no longer reports missing User fields.

**Complexity:** simple

---

## Chunk 2 — Shared storage implementation
**Files:**
- `apps/backend/src/core/storage/local-storage.service.ts`
- `apps/backend/src/core/storage/index.ts`
- `apps/backend/src/core/core.module.ts`
- `apps/backend/src/core/events/in-memory-event-publisher.service.ts`
- `apps/backend/src/core/events/index.ts`

**Actions:**
1. Implement `LocalStorageService implements StorageService` using the exact interface `upload(path: string, file: StorageFile): Promise<string>`.
   - Write `Buffer` to `{UPLOAD_ROOT}/{path}` (create directories as needed).
   - Return the same relative `path` that was passed in.
   - `download`, `delete` (swallow `ENOENT`), `exists`.
2. Provide `StorageService` from `CoreModule`: `{ provide: 'StorageService', useClass: LocalStorageService }`.
3. Default `UPLOAD_ROOT` reads from `config.storage.uploadRoot` (fallback `./uploads`).
4. Provide a default `EventPublisher` implementation:
   - `InMemoryEventPublisher` that stores published events in an array and exposes `publishedEvents()` for tests.
   - Register in `CoreModule` as `{ provide: 'EventPublisher', useClass: InMemoryEventPublisher }`.

**Acceptance criteria:**
- `LocalStorageService` compiles and passes a unit test round-trip.
- `CoreModule` exports the `StorageService` and `EventPublisher` tokens.

**Complexity:** simple

---

## Chunk 3 — Users DTOs and types
**Files:**
- `apps/backend/src/users/dto/profile-response.dto.ts`
- `apps/backend/src/users/dto/update-profile.dto.ts`
- `apps/backend/src/users/dto/update-preferences.dto.ts`
- `apps/backend/src/users/dto/update-privacy.dto.ts`
- `apps/backend/src/users/dto/session-response.dto.ts`
- `apps/backend/src/users/dto/index.ts`
- `apps/backend/src/users/users.types.ts`

**Actions:**
1. **ProfileResponseDto**: id, email, role, status, emailVerified, displayName, username, bio, location, website, timezone, language, dateFormat, themePreference, avatar, coverImage, preferences, privacy, createdAt, updatedAt.
2. **UpdateProfileDto**: all optional, with decorators from the validation rules table.
3. **UpdatePreferencesDto**: optional fields per the validation rules table.
4. **UpdatePrivacyDto**: six optional visibility fields (`profileVisibility`, `collectionVisibility`, `journalVisibility`, `timelineVisibility`, `wrappedVisibility`, `searchVisibility`).
5. **SessionResponseDto**: id, browser, os, ipAddress, lastSeen (Date), isCurrent (boolean), status (string), createdAt.
6. **users.types.ts**: TypeScript interfaces `UserPreferences`, `UserPrivacy`, `ParsedUserAgent`, and domain event classes `UserProfileUpdatedEvent`, `UserPreferencesUpdatedEvent`, `UserPrivacyUpdatedEvent`, `UserAvatarUpdatedEvent` extending `DomainEvent`.

**Acceptance criteria:**
- DTOs compile with class-validator decorators.
- Domain event classes extend `DomainEvent`.

**Complexity:** simple

---

## Chunk 4 — Users repository and audit helper
**Files:**
- `apps/backend/src/users/users.repository.ts` + `.spec.ts`
- `apps/backend/src/users/services/user-audit-log.service.ts` + `.spec.ts`

**Actions:**
1. **UsersRepository** extends `BaseRepository<User>`.
   - `findByIdWithProfile(id): Promise<User | null>`
   - `findByUsername(username): Promise<User | null>`
   - `findByUsernameExcludingUserId(username, userId): Promise<User | null>`
   - `updateProfile(id, data): Promise<User>`
   - `updatePreferences(id, data): Promise<User>`
   - `updatePrivacy(id, data): Promise<User>`
   - `updateAvatar(id, url): Promise<User>` / `removeAvatar(id): Promise<User>`
   - `findSessionsByUserId(userId, now): Promise<Session[]>` — `status: ACTIVE`, `deletedAt: null`, `expiresAt: { gt: now }`, ordered by `createdAt desc`.
   - `findSessionByIdAndUserId(sessionId, userId): Promise<Session | null>`
   - `revokeSession(sessionId, userId): Promise<Session>` — updates `{ status: 'REVOKED', deletedAt: new Date() }` scoped by `id` and `userId`.
2. **UserAuditLogService**
   - `logChange(userId, entityType, entityId, previousValue, newValue, metadata?): Promise<void>`
   - Writes to `AuditLog` with `action: 'UPDATE'`, `ipAddress` and `userAgent` from `RequestContextService` if available, `metadata` including `correlationId`.

**Acceptance criteria:**
- Repository unit tests pass with mocked Prisma Client.
- Audit helper writes an `AuditLog` row when called.

**Complexity:** simple

---

## Chunk 5 — Domain services
**Files:**
- `apps/backend/src/users/services/profile.service.ts` + `.spec.ts`
- `apps/backend/src/users/services/preferences.service.ts` + `.spec.ts`
- `apps/backend/src/users/services/privacy.service.ts` + `.spec.ts`
- `apps/backend/src/users/services/avatar.service.ts` + `.spec.ts`
- `apps/backend/src/users/services/user-agent-parser.ts` + `.spec.ts`
- `apps/backend/src/users/services/index.ts`

**Actions:**
1. **UserAgentParser**: naive regex parser returning `{ browser?: string; os?: string }`.
2. **ProfileService**
   - Normalize username: trim, lowercase, replace spaces/special chars with `_`, then validate against `/^[a-z0-9_]+$/i`.
   - Block reserved usernames.
   - Check uniqueness via `findByUsernameExcludingUserId`.
   - Validate website/timezone/language/dateFormat/themePreference.
   - Return `Result<ProfileResponseDto, BusinessException>`.
3. **PreferencesService**
   - Fetch existing preferences JSON, merge with DTO, validate enum/boolean values, persist via repository.
   - Return `Result<UserPreferences, BusinessException>`.
4. **PrivacyService**
   - Fetch existing privacy JSON, merge with DTO, validate visibility enums, persist via repository.
   - Return `Result<UserPrivacy, BusinessException>`.
5. **AvatarService**
   - Validate MIME type and size; generate full storage path `avatars/{userId}/{uuid}.{ext}`.
   - Call `StorageService.upload(path, { buffer, mimeType, originalName })`.
   - On replacement, delete previous avatar path via `StorageService.delete`.
   - On deletion, remove file and clear `User.avatar`.
   - Return `Result<string, BusinessException>` (the stored path).

**Acceptance criteria:**
- Each service has passing unit tests, including validation failures.
- Avatar validation rejects oversized/non-image files.
- Username uniqueness and reserved-name checks return `ConflictException`.

**Complexity:** simple

---

## Chunk 6 — UsersService orchestrator
**Files:**
- `apps/backend/src/users/users.service.ts` + `.spec.ts`

**Actions:**
1. **UsersService** injects the four domain services, repository, audit service, event publisher, and `RequestContextService`.
   - `getMe(userId): Promise<ProfileResponseDto>`
   - `updateProfile(userId, dto, metadata?)` — delegates to `ProfileService`, writes audit log, emits `UserProfileUpdatedEvent`.
   - `updatePreferences(userId, dto, metadata?)` — delegates to `PreferencesService`, writes audit log, emits `UserPreferencesUpdatedEvent`.
   - `updatePrivacy(userId, dto, metadata?)` — delegates to `PrivacyService`, writes audit log, emits `UserPrivacyUpdatedEvent`.
   - `updateAvatar(userId, file, metadata?)` — delegates to `AvatarService`, writes audit log, emits `UserAvatarUpdatedEvent`.
   - `deleteAvatar(userId, metadata?)` — delegates to `AvatarService`, writes audit log.
   - `listSessions(userId, refreshToken)` — loads sessions via repository; marks the session where `session.token === refreshToken` as `isCurrent`; maps `lastSeen` to `session.updatedAt`.
   - `revokeSession(userId, sessionId)` — ownership enforced via `findSessionByIdAndUserId`; throws `NotFoundException` if missing.
2. Metadata passed to audit includes `ipAddress` and `userAgent` from the request.
3. `RequestContextService.getCorrelationId()` is included in audit `metadata` and optionally in event metadata.

**Acceptance criteria:**
- `UsersService` integration test covers happy paths and ownership failures.
- Domain events are published after successful mutations.

**Complexity:** simple

---

## Chunk 7 — Controller and module wiring
**Files:**
- `apps/backend/src/users/users.controller.ts`
- `apps/backend/src/users/users.module.ts`
- `apps/backend/src/app.module.ts`

**Actions:**
1. **UsersController** (`@Controller('users')`), all routes guarded by `JwtAuthGuard`.
   - `@Get('me')` → `getMe(@CurrentUser() user)`
   - `@Patch('me')` → `updateProfile(@CurrentUser() user, @Body() dto, @Req() req)`
   - `@Patch('me/preferences')` → `updatePreferences(...)`
   - `@Patch('me/privacy')` → `updatePrivacy(...)`
   - `@Post('me/avatar') @UseInterceptors(FileInterceptor('avatar'))` → `updateAvatar(@CurrentUser() user, @UploadedFile(new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), new FileTypeValidator({ fileType: /\.(jpg|jpeg|png|webp)$/ })] })) file, @Req() req)`
   - `@Delete('me/avatar')` → `deleteAvatar(...)`
   - `@Get('me/sessions')` → `listSessions(@CurrentUser() user, @Req() req)`
   - `@Delete('me/sessions/:id')` → `revokeSession(@CurrentUser() user, @Param('id') sessionId, @Req() req)`
2. Pass `ipAddress` (`req.ip`) and `userAgent` (`req.headers['user-agent']`) from `Req` into service calls.
3. **UsersModule** imports `SharedModule` and `AuthModule`; registers controller, services, repository, and audit helper.
4. **AuthModule** exports `JwtAuthGuard` so `UsersController` can use `@UseGuards(JwtAuthGuard)`.
5. **CookieService** path changes from `/api/auth` to `/api` (see Constraints rationale).
6. **AppModule** imports `UsersModule`.

**Acceptance criteria:**
- All routes compile.
- `bun run build` succeeds.

**Complexity:** simple

---

## Chunk 8 — Tests
**Files:**
- `apps/backend/src/core/storage/local-storage.service.spec.ts`
- `apps/backend/src/core/events/in-memory-event-publisher.spec.ts`
- `apps/backend/src/users/services/*.spec.ts`
- `apps/backend/src/users/users.repository.spec.ts`
- `apps/backend/src/users/users.service.spec.ts`
- `apps/backend/test/users.e2e.spec.ts`

**Actions:**
1. Unit tests for `LocalStorageService`, `InMemoryEventPublisher`, `UserAgentParser`, `ProfileService`, `PreferencesService`, `PrivacyService`, `AvatarService`, `UsersRepository`, `UserAuditLogService`.
2. Integration test for `UsersService` with mocked Prisma Client and `StorageService`.
3. E2E test for the full controller flow:
   - `GET /api/users/me` returns 401 without token and profile with token.
   - `PATCH /api/users/me` updates profile and rejects duplicate username.
   - `PATCH /api/users/me/preferences` and `/privacy` update JSON fields.
   - `POST /api/users/me/avatar` rejects invalid files and accepts image.
   - `DELETE /api/users/me/avatar` clears avatar.
   - `GET /api/users/me/sessions` lists sessions and marks current device.
   - `DELETE /api/users/me/sessions/:id` revokes the session.
4. Mock `StorageService` in E2E with an in-memory implementation to avoid disk I/O.

**Acceptance criteria:**
- All new tests pass with `bun test`.
- No test asserts on concurrent ordering.

**Complexity:** simple

---

## Verification
After all chunks:
1. `cd /mnt/d/chronicle-your-media-story-mainzipzip/apps/backend && bun run format`
2. `bun run lint`
3. `bun run build`
4. `bun test`

Fix every issue before finishing.

---

## Ownership & Session Integration Notes
- **Ownership enforcement:** every controller method receives the authenticated user via `@CurrentUser()`. The service layer passes `userId` to repository queries that always include `userId` (e.g., `findSessionByIdAndUserId`), so a user can only read or mutate their own profile, preferences, privacy, avatar, and sessions.
- **Session integration:** `GET /api/users/me/sessions` reads the raw `refresh_token` HTTP-only cookie (now scoped to `/api` so it reaches `/api/users/*`) and compares it to each `Session.token` (stored as plain text, matching the existing `SessionService.validate` behavior). The matching session is flagged `isCurrent`. `DELETE /api/users/me/sessions/:id` performs a user-scoped soft delete (`status: REVOKED`, `deletedAt: now`) so the existing `AuthModule` refresh flow will reject the token on next use. `POST /api/auth/logout-all` remains untouched.
- **Audit:** every mutating profile/preference/privacy/avatar operation writes an `AuditLog` record with `previousValue`, `newValue`, and `metadata` that includes the correlation ID from `RequestContextService` plus IP/user-agent.
- **Domain events:** `UsersService` publishes typed domain events after successful mutations via the `EventPublisher` abstraction. The default in-memory publisher satisfies the interface for tests and local development.
