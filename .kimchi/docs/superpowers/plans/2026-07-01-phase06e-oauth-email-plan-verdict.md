# Phase 06E Implementation Plan Verdict

**Plan:** `/mnt/d/chronicle-your-media-story-mainzipzip/.kimchi/docs/superpowers/plans/2026-07-01-phase06e-oauth-email-plan.md`

**Verdict:** NEEDS_REVISION

The plan covers the major OAuth/email-verification/account-linking features, but it leaves several design decisions unresolved, contains internal contradictions, and omits security/audit wiring that the original Phase 06E requirements expect. It should be revised before a Builder starts implementation.

---

## Gaps and Required Revisions

1. **Email-verification token invalidation cannot use `deletedAt` as proposed.**
   - **Reference:** Chunk 2, `apps/backend/src/auth/repositories/email-verification-token.repository.ts`, `invalidatePreviousForUser` action.
   - **Problem:** The `EmailVerificationToken` model in `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend/prisma/schema.prisma` has no `deletedAt` column. The plan instructs the Builder to "sets `deletedAt` or `verifiedAt` on existing unverified tokens", which would cause a Prisma type/runtime error.
   - **Suggested fix:** Restrict invalidation to setting `verifiedAt = now()` on previous unverified tokens, or add a `deletedAt` field to the model (which the plan explicitly forbids under Constraints). Update the repository action accordingly.

2. **Internal contradiction on expired-token error handling.**
   - **Reference:** Chunk 3, `apps/backend/src/auth/services/email-verification.service.ts`, `verifyEmail` and Acceptance Criteria.
   - **Problem:** `verifyEmail` says "Throw `NotFoundException` if missing/expired/already verified", but the acceptance criteria require "Expired token throws `ForbiddenException`". A Builder cannot satisfy both.
   - **Suggested fix:** Adopt a consistent policy: `NotFoundException` for missing/already-used tokens and `ForbiddenException` only for expired tokens; document it in both the service description and acceptance criteria.

3. **Registration does not set `PENDING_VERIFICATION` status, making the post-verification status transition a no-op.**
   - **Reference:** Chunk 6, `apps/backend/src/auth/auth.service.ts` (update `register`); existing `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend/src/auth/auth.repository.ts` lines 33-41.
   - **Problem:** `AuthRepository.create` currently hard-codes `status: 'ACTIVE'`. The plan says `verifyEmail` should "Update user ... `status: 'ACTIVE'` if currently `PENDING_VERIFICATION`", but no registration path creates a user in `PENDING_VERIFICATION`. As a result, email verification is not actually gating account activation.
   - **Suggested fix:** In Chunk 6, instruct the Builder to change `AuthRepository.create` so password registrations create users with `status: 'PENDING_VERIFICATION'` and `emailVerified: false`, and only `verifyEmail` flips both fields to `ACTIVE`/`true`.

4. **No guidance on blocking login for unverified users.**
   - **Reference:** `apps/backend/src/auth/services/auth.service.ts` `login`; Chunk 6.
   - **Problem:** If email verification is enabled, the existing `AuthService.login` must reject users whose `emailVerified` is `false`/`status` is `PENDING_VERIFICATION`. The plan does not mention this, so a Builder will leave a security hole where unverified users can still authenticate.
   - **Suggested fix:** Add a step in Chunk 6 to throw a `ForbiddenException` (or business equivalent) in `AuthService.login` when `emailVerification` is enabled and the user is not verified.

5. **The verification email link does not match the defined API contract.**
   - **Reference:** Chunk 3, `EmailVerificationService.sendVerification` link format; Chunk 5, `EmailVerificationController`.
   - **Problem:** The generated link is `{baseUrl}/auth/email/verify?token={raw}` (a GET URL), but the only endpoint defined is `POST /auth/email/verify`. Clicking the emailed link will 404.
   - **Suggested fix:** Either add a `GET /auth/email/verify?token=` endpoint that validates the token and redirects to a configured frontend success/failure URL, or change the email to instruct the user to paste the token and keep the POST endpoint only. Document the chosen approach.

6. **Audit-log and security-event wiring is underspecified.**
   - **Reference:** Chunk 3, "Audit: write `AuditLog` with `action: 'EMAIL_VERIFIED'`"; Chunk 4, "write `AuditLog` `OAUTH_LINK` / `CREATE`".
   - **Problem:** There is no existing `AuditLogService` in the `AuthModule`. The project has `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend/src/users/services/user-audit-log.service.ts`, but it only supports `UPDATE` actions and is not wired into AuthModule. The plan also ignores the existing `SecurityEvent` model and `SecurityEventType.EMAIL_VERIFICATION_SENT`, even though Phase 06E security requirements expect security-event recording.
   - **Suggested fix:** Add a dedicated chunk (or extend Chunk 2/3) that creates an auth-scoped audit/security service, wires it through `AuthModule`, and explicitly records:
     - `AuditLog` actions: `EMAIL_VERIFIED`, `OAUTH_LINK`, `CREATE` (for OAuth sign-up).
     - `SecurityEvent` entries: `EMAIL_VERIFICATION_SENT`, and optionally `SUCCESSFUL_LOGIN` during OAuth callback.

7. **`RequestContextService` is not used for audit/security metadata in the new flows.**
   - **Reference:** Chunk 4/5, OAuth callback controller; Chunk 3, `EmailVerificationService.verifyEmail`.
   - **Problem:** The plan lists `RequestContextService` as an existing abstraction to reuse, but never says how to populate it with `userId`, `ipAddress`, or `userAgent` for the OAuth callback or email-verification endpoints. Audit logs would be missing request context.
   - **Suggested fix:** Specify that `GoogleOAuthController` and `EmailVerificationController` pass `req.ip`/`req.headers['user-agent']` to the service layer, and that audit/security logging consumes those values (or uses `RequestContextService.run` if middleware already populates it).

8. **BaseRepository abstract methods are not addressed for the new repositories.**
   - **Reference:** Chunk 2, `OAuthAccountRepository` and `EmailVerificationTokenRepository`.
   - **Problem:** `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend/src/core/repository/base-repository.ts` defines abstract `findById`, `exists`, `save`, and `delete`. The plan only lists custom methods (`findByProviderAndAccountId`, `create`, etc.), so a Builder must invent implementations for the required abstract methods.
   - **Suggested fix:** Add the required `findById`, `exists`, `save`, and `delete` method signatures to both repository specifications, clarifying whether `delete` is a hard delete or soft delete (the schema has `deletedAt` only on `OAuthAccount`, not on `EmailVerificationToken`).

9. **OAuth linking by email does not require Google's email to be verified.**
   - **Reference:** Chunk 4, `GoogleOAuthService.validateOrCreate`, step 2.
   - **Problem:** The service links a Google profile to an existing local account solely because the email matches. It never checks the Google `emails[0].verified` flag, allowing account takeover via an unverified Google email.
   - **Suggested fix:** Add a guard: only link to an existing user when `profile.emails[0].verified === true`; otherwise create a new pending user or reject the login.

10. **Dependency versions are not specified.**
    - **Reference:** Chunk 1, dependency installation step.
    - **Problem:** The plan says `bun add @nestjs/passport passport passport-google-oauth20` without version constraints. Unpinned installs risk pulling a future major version incompatible with NestJS 11.
    - **Suggested fix:** Pin to compatible ranges, e.g. `@nestjs/passport@^11.0.0`, `passport@^0.7.0`, `passport-google-oauth20@^2.0.0`, `@types/passport-google-oauth20@^2.0.16`.

11. **E2E token extraction strategy is vague.**
    - **Reference:** Chunk 6, Email verification E2E test.
    - **Problem:** The plan says "extract token from transport or response". Registration returns a `UserResponseDto`, not the verification token, so the response path will not work without a spy on `ConsoleEmailTransportService`.
    - **Suggested fix:** Explicitly state that the E2E test must override the `EmailTransport` provider with a test spy that captures the raw token/link.

12. **DTO validation constraints are not specified.**
    - **Reference:** Chunk 5, `VerifyEmailDto` and `ResendVerificationDto`.
    - **Problem:** The DTOs are mentioned but no validation decorators are listed. A Builder may omit `@IsEmail` on `ResendVerificationDto.email`.
    - **Suggested fix:** Add validation requirements: `VerifyEmailDto.token` must be `@IsString()`, `@IsNotEmpty()`; `ResendVerificationDto.email` must be `@IsEmail()`.

---

## Build Feasibility Check

- **Baseline build status:** `cd /mnt/d/chronicle-your-media-story-mainzipzip/apps/backend && bun run build` completed successfully before any plan implementation.
- **Chunk-by-chunk feasibility:**
  - Chunks 1, 2, 3, 4, and 5 are feasible for a standard-tier Builder **after the above ambiguities are resolved**. The main blockers are the unspecified `BaseRepository` methods and the missing `deletedAt` field on `EmailVerificationToken`.
  - Chunk 6 (E2E tests) is feasible once the email-transport spy and the GET-vs-POST verification endpoint contract are clarified.
  - Chunk 7 (format/lint/build/test) is feasible; the existing `bun test ./src ./test` script works.
- **Concern:** Because the plan leaves multiple security-critical decisions (login gating, email-verified linking, audit/security-event wiring) undefined, a Builder would have to invent them, increasing the risk of regressions.

---

## Requirement Coverage Check

| Phase 06E Requirement | Coverage | Notes |
|---|---|---|
| Google OAuth2 implementation | Covered | Passport strategy, service, controller, and `finishOAuthLogin` are all specified. |
| Email verification | Partially covered | Token generation/storage/verification flow is specified, but the GET link/POST endpoint mismatch, login gating, and `PENDING_VERIFICATION` status transition are missing. |
| Account linking | Partially covered | Linking flow is described, but lacks the Google `email.verified` guard. |
| Endpoints | Covered | `/auth/google`, `/auth/google/callback`, `/auth/email/verify`, `/auth/email/resend` are listed. |
| Security | Insufficient | Missing login gating for unverified users, missing Google email-verified guard, and missing security-event recording. |
| Tests | Covered | Unit, integration, and E2E tests are planned. |
| Quality / verification | Covered | Format, lint, build, test steps are listed. |

**Unaddressed requirements:**
- Blocking authentication for unverified users.
- Recording security events for verification/OAuth flows.
- Ensuring OAuth account linking only occurs when Google's email is verified.

---

## Dependency / Installation Feasibility Check

- **Proposed packages:**
  - `@nestjs/passport`
  - `passport`
  - `passport-google-oauth20`
  - `@types/passport-google-oauth20` (dev)

- **Compatibility assessment:**
  - NestJS 11 is installed (`@nestjs/common@^11.0.0`). `@nestjs/passport@^11.0.0` is the matching major version and is expected to work.
  - `passport@^0.7.0` is the current stable release and is compatible with NestJS Passport.
  - `passport-google-oauth20@^2.0.0` is stable and works with Passport 0.7.x.
  - `@types/passport-google-oauth20@^2.0.16` provides the correct TypeScript definitions.
  - The runtime is Bun. Passport strategies are plain Node.js middleware and install cleanly under Bun.

- **Concerns:**
  - Without version pins, a future major release could break the build. Add explicit ranges.
  - `passport-google-oauth20` has no native Bun-specific issues, but the OAuth callback in local/test environments requires a valid `GOOGLE_CALLBACK_URL` and matching Google console configuration; this is operational, not a code feasibility issue.

---

## Summary

The plan is a reasonable high-level outline but needs revision on repository semantics, verification state handling, endpoint contract, audit/security wiring, and dependency pinning before implementation. Address the 12 numbered gaps above and re-submit for approval.
