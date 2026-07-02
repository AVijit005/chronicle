# Phase 06D User Domain — Review Report

## Verdict

NEEDS_FIXES

## Verification Summary

All verification commands were run from `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend`:

- `bun run lint` — passed
- `bun run build` — passed (`nest build` completed with no errors)
- `bun test` — **154 pass, 0 fail, 326 expect() calls, 18 files**

## Issues

### 1. Avatar upload endpoint does not use `ParseFilePipe`

- **File:** `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend/src/users/users.controller.ts`
- **Lines:** 57–70 (`updateAvatar`)
- **Problem:** The `@UploadedFile()` decorator has no pipe, so missing files, oversized files, or files with invalid extensions reach the service layer (or throw a runtime `TypeError` when no file is supplied). The implementation plan explicitly requires:

  ```ts
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /\.(jpg|jpeg|png|webp)$/ }),
      ],
    }),
  )
  ```

  Currently the controller only relies on `AvatarService.uploadAvatar` to reject bad input, which is later and less idiomatic than the spec.
- **Suggested fix:** Add the `ParseFilePipe` with the `MaxFileSizeValidator` and `FileTypeValidator` exactly as described in the plan. Also import `ParseFilePipe`, `MaxFileSizeValidator`, and `FileTypeValidator` from `@nestjs/common`.

### 2. Username validation in `UpdateProfileDto` is applied before normalization

- **File:** `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend/src/users/dto/update-profile.dto.ts`
- **Lines:** 12–18 (`username` field)
- **Problem:** The DTO applies `@Length(3, 30)` and `@Matches(/^[a-z0-9_]+$/i)` to the raw request value. `ProfileService.normalizeUsername` (in `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend/src/users/services/profile.service.ts` lines 181–202) is designed to trim whitespace, lowercase, and replace spaces/special characters with underscores, but the controller-level validation pipe rejects those inputs before normalization can run. For example, a request with `"username": "  Alice Smith  "` will fail with a 400 even though the normalized value `alice_smith` is valid and not reserved.
- **Suggested fix:** Remove `@Length(3, 30)` and `@Matches(...)` from the `username` property in `UpdateProfileDto` (keep `@IsOptional()` and `@IsString()`), and let `ProfileService` perform normalization and reserved-name/uniqueness validation. Alternatively, add a class-transformer `@Transform()` that normalizes the value before the `@Matches` validator runs.

### 3. `UsersService` instantiates `UserAgentParser` instead of using the injected provider

- **File:** `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend/src/users/users.service.ts`
- **Line:** 38 (`private readonly agentParser = new UserAgentParser();`)
- **Problem:** `UsersModule` registers `UserAgentParser` as a provider, but `UsersService` ignores it and creates a private instance. This bypasses NestJS DI, makes the provider registration effectively unused, and prevents tests from substituting the parser.
- **Suggested fix:** Inject `UserAgentParser` through the constructor and remove the private field instantiation:

  ```ts
  constructor(
    // ... existing injections ...
    private readonly agentParser: UserAgentParser,
  ) {}
  ```

### 4. `UsersRepository.revokeSession` update is not scoped by `userId`

- **File:** `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend/src/users/users.repository.ts`
- **Lines:** 85–93 (`revokeSession`)
- **Problem:** The method first finds the session by `id` and `userId` in `UsersService.revokeSession`, but the Prisma `update` call only uses `where: { id: sessionId }` and includes an unnecessary `user: { connect: { id: userId } }`. This is not an atomic ownership-scoped update; if the session’s owner changed between the read and write, the write would still succeed. The spec calls for the update to be scoped by both `id` and `userId`.
- **Suggested fix:** Use an atomic `updateMany` scoped by both fields, and have the service return the session object it already looked up:

  ```ts
  async revokeSession(sessionId: string, userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { id: sessionId, userId },
      data: { status: 'REVOKED', deletedAt: new Date() },
    });
  }
  ```

  Then update the repository unit test expectation to match the new call shape.

## Brief Assessment

- **Ownership enforcement:** Strong at the service/repository boundary. Every mutating endpoint uses `@CurrentUser()` and passes `userId` to repository methods that include `userId` in their queries (`findByUsernameExcludingUserId`, `findSessionByIdAndUserId`, etc.). The only weakness is the non-atomic `revokeSession` update described in Issue 4.
- **Session integration:** Correctly implemented. `GET /api/users/me/sessions` reads the refresh cookie (now scoped to `/api`) and flags the matching session as `isCurrent`. `DELETE /api/users/me/sessions/:id` performs a user-scoped soft delete with `status: REVOKED` and `deletedAt: now`, which the existing auth refresh flow will reject.
- **Audit logging:** Every mutating profile/preference/privacy/avatar operation writes an `AuditLog` row with `previousValue`, `newValue`, and metadata containing the correlation ID, IP, and user-agent. `UserAuditLogService` unit tests cover context/explicit correlation ID precedence.
- **Validation coverage:** Most profile, preference, privacy, and avatar rules are validated, either in the DTO or the domain service. The main gap is the controller-level username validation running before normalization (Issue 2) and the missing avatar file pipe (Issue 1).
- **Test quality:** Good coverage. Unit tests exist for all new services, the repository, the audit helper, local storage, and the event publisher. The E2E spec exercises the full controller flow including 401/404 paths, duplicate usernames, preferences/privacy merges, avatar upload/rejection/deletion, and session listing/revocation. Tests do not assert on concurrent ordering.
- **Adherence to the spec:** The implementation closely follows the plan. The schema changes, module wiring, DTO shapes, domain events, audit logging, and session integration all match the specification. The four issues above are the remaining deviations.
