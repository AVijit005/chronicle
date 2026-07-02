# Phase 06E — Google OAuth, Email Verification & Account Linking Implementation Plan

## Objective
Extend the existing `AuthModule` with Google OAuth2 login, email verification, and OAuth account linking, reusing Phase 06C session/refresh/cookie services and Phase 06D shared abstractions.

## Constraints
- Do not redesign authentication, user profile, session architecture, or JWT flow.
- Do not modify Prisma schema unless a critical bug requires it. (`OAuthAccount` and `EmailVerificationToken` already exist; `EmailVerificationToken` has no `deletedAt`.)
- Use existing `SessionService`, `RefreshTokenService`, `CookieService`, `JwtTokenService`, `TokenFactory`, `PasswordService`, `RequestContextService`, business exceptions, and `BaseRepository`.
- Use Bun as the runtime; all verification commands must pass.

## New Dependencies (justified)
Google OAuth requires a Passport strategy. Install into `apps/backend` with pinned ranges:
- `@nestjs/passport@^11.0.0`
- `passport@^0.7.0`
- `passport-google-oauth20@^2.0.0`
- dev: `@types/passport-google-oauth20@^2.0.16`

No email-sending library is added. A custom `EmailTransport` abstraction is used; a `ConsoleEmailTransportService` is provided for local/test environments.

## Schema Notes (no changes)
Existing models already support the feature:
- `OAuthAccount` with `provider` enum (`GOOGLE`), `providerAccountId`, tokens, and `@@unique([provider, providerAccountId])`.
- `EmailVerificationToken` with `userId`, `email`, `tokenHash`, `expiresAt`, `verifiedAt` (no `deletedAt`).
- `User.emailVerified`, `User.status`, nullable `passwordHash`, and `oauthAccounts` relation.

---

## Chunk 1 — Dependencies and environment wiring
**Files:**
- `apps/backend/package.json`
- `apps/backend/src/config/env.validation.ts`
- `apps/backend/src/config/configuration.ts`
- `apps/backend/.env.example`
- `apps/backend/.env`

**Actions:**
1. `bun add @nestjs/passport@^11.0.0 passport@^0.7.0 passport-google-oauth20@^2.0.0`
2. `bun add -d @types/passport-google-oauth20@^2.0.16`
3. Add env vars to `env.validation.ts`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL`
   - `EMAIL_VERIFICATION_TTL_SECONDS` (default 86400)
   - `EMAIL_VERIFICATION_REQUIRED` (default `true`)
   - `APP_BASE_URL` (used in verification email links)
   - `EMAIL_VERIFICATION_SUCCESS_URL` (frontend redirect after GET verification)
   - `EMAIL_VERIFICATION_FAILURE_URL` (frontend redirect after failed GET verification)
4. Add config sections in `configuration.ts`:
   - `google: { clientId, clientSecret, callbackUrl }`
   - `emailVerification: { ttlSeconds, required, baseUrl, successUrl, failureUrl }`
5. Update `.env.example` and `.env` with placeholder values.

**Acceptance criteria:**
- `bun install` succeeds.
- `bun run build` still passes before new code is added.

**Complexity:** simple

---

## Chunk 2 — Repositories, audit/security service, and email transport abstraction
**Files:**
- `apps/backend/src/auth/repositories/oauth-account.repository.ts` + `.spec.ts`
- `apps/backend/src/auth/repositories/email-verification-token.repository.ts` + `.spec.ts`
- `apps/backend/src/auth/repositories/index.ts`
- `apps/backend/src/auth/services/auth-audit.service.ts` + `.spec.ts`
- `apps/backend/src/auth/services/email-transport.abstraction.ts`
- `apps/backend/src/auth/services/console-email-transport.service.ts` + `.spec.ts`
- `apps/backend/src/auth/services/index.ts`

**Actions:**
1. **OAuthAccountRepository** extends `BaseRepository<OAuthAccount>` and implements required abstract methods:
   - `findById(id)`, `exists(id)`, `save(entity)`, `delete(id)` (soft delete via `deletedAt`)
   - `findByProviderAndAccountId(provider, providerAccountId)`
   - `create(data)`
2. **EmailVerificationTokenRepository** extends `BaseRepository<EmailVerificationToken>` and implements required abstract methods:
   - `findById(id)`, `exists(id)`, `save(entity)`, `delete(id)` (hard delete)
   - `findByTokenHash(tokenHash)`
   - `create(data)`
   - `markVerified(id)` — sets `verifiedAt: now()`.
   - `invalidatePreviousForUser(userId)` — sets `expiresAt: now()` on any row for the user where `verifiedAt` is null and `expiresAt` is in the future.
3. **AuthAuditService**
   - `logAudit(action: AuditAction, userId, entityType, entityId, previousValue?, newValue?, metadata?)` — writes to `AuditLog`.
   - `logSecurityEvent(userId, type: SecurityEventType, severity, metadata?)` — writes to `SecurityEvent`.
   - Accepts optional `ipAddress`/`userAgent` in metadata.
4. **EmailTransport** interface:
   ```ts
   sendVerificationEmail(to: string, options: { token: string; link: string; userDisplayName?: string }): Promise<void>
   ```
5. **ConsoleEmailTransportService** implements `EmailTransport`; logs token/link to console.
6. Provide `EmailTransport` token from `AuthModule`.

**Acceptance criteria:**
- Repositories have unit tests with mocked Prisma Client covering required abstract methods.
- Console transport has a unit test capturing the sent token/link.
- AuthAuditService unit tests verify AuditLog and SecurityEvent rows.

**Complexity:** simple

---

## Chunk 3 — Verification token service and email verification service
**Files:**
- `apps/backend/src/auth/services/verification-token.service.ts` + `.spec.ts`
- `apps/backend/src/auth/services/email-verification.service.ts` + `.spec.ts`

**Actions:**
1. **VerificationTokenService**
   - `generateToken()` — uses `TokenFactory.generateSecureToken(32)`.
   - `hashToken(token)` — uses `crypto.createHash('sha256').update(token).digest('hex')`.
   - Repository methods delegated.
2. **EmailVerificationService**
   - `sendVerification(userId, email, displayName?, metadata?)`:
     - Generate raw token + hash.
     - Invalidate previous unverified tokens for the user (set `expiresAt: now()`).
     - Store `EmailVerificationToken` with hash and expiry.
     - Call `EmailTransport.sendVerificationEmail` with `{ token, link: {baseUrl}/auth/email/verify?token={raw} }`.
     - Call `AuthAuditService.logSecurityEvent(userId, 'EMAIL_VERIFICATION_SENT', 'LOW', metadata)`.
     - Return `{ email }`.
   - `verifyEmail(rawToken, metadata?)`:
     - Hash token, look up token row.
     - Throw `NotFoundException` if missing or already verified.
     - Throw `ForbiddenException` if expired.
     - Mark token `verifiedAt`.
     - Update user `emailVerified: true`, `status: 'ACTIVE'` if currently `PENDING_VERIFICATION`.
     - Call `AuthAuditService.logAudit('EMAIL_VERIFIED', userId, 'User', userId, { emailVerified: false }, { emailVerified: true }, metadata)`.
     - Return `UserResponseDto`.
   - `resendVerification(email, metadata?)`:
     - Find user by email.
     - Throw `NotFoundException` if user missing or already verified.
     - Call `sendVerification`.
     - Return `{ email }`.

**Acceptance criteria:**
- Token is one-time; second verify throws `NotFoundException`.
- Expired token throws `ForbiddenException`.
- Resend invalidates previous unverified tokens.

**Complexity:** simple

---

## Chunk 4 — Google OAuth service and strategy
**Files:**
- `apps/backend/src/auth/services/google-oauth.service.ts` + `.spec.ts`
- `apps/backend/src/auth/strategies/google.strategy.ts`
- `apps/backend/src/auth/dto/google-profile.dto.ts`
- `apps/backend/src/auth/dto/index.ts` (update)

**Actions:**
1. **GoogleProfileDto** — `provider: 'google'`, `providerAccountId`, `email`, `emailVerified`, `displayName?`, `firstName?`, `lastName?`, `picture?`, `accessToken`, `refreshToken?`, `idToken?`, `expiresAt?`.
2. **GoogleOAuthService**
   - `validateOrCreate(profile, metadata?): Promise<{ user: User; isNew: boolean; isLinked: boolean }>`:
     1. Reject with `ForbiddenException` if `profile.emailVerified` is `false`.
     2. Find `OAuthAccount` by `GOOGLE` + `providerAccountId`. If found, return `{ user, isNew: false, isLinked: false }`.
     3. Find `User` by `email`. If found:
        - Create `OAuthAccount` linked to the existing user.
        - Set `emailVerified: true` on user if not already.
        - Call `AuthAuditService.logAudit('OAUTH_LINK', user.id, 'User', user.id, null, { provider: 'GOOGLE', providerAccountId }, metadata)`.
        - Return `{ user, isNew: false, isLinked: true }`.
     4. If no user, create a new `User` (`passwordHash: null`, `emailVerified: true`, `status: 'ACTIVE'`), create `OAuthAccount`, call `AuthAuditService.logAudit('CREATE', user.id, 'User', user.id, null, { provider: 'GOOGLE' }, metadata)`.
        - Return `{ user, isNew: true, isLinked: false }`.
   - Uses `AuthRepository` and `OAuthAccountRepository`.
3. **GoogleStrategy** extends `PassportStrategy(GoogleStrategy, 'google')`.
   - Configure `clientID`, `clientSecret`, `callbackURL`, `scope: ['email', 'profile']`, `state: true`.
   - `validate(accessToken, refreshToken, profile)` maps Google profile to `GoogleProfileDto` and calls `GoogleOAuthService.validateOrCreate`.
   - Returns `{ sub: user.id, email: user.email }`.

**Acceptance criteria:**
- Existing password user can be linked via Google email only when Google email is verified.
- New Google-only user is created without password.
- Unverified Google email is rejected.
- Duplicate provider account returns existing user.

**Complexity:** simple

---

## Chunk 5 — Controllers and AuthService wiring
**Files:**
- `apps/backend/src/auth/controllers/google-oauth.controller.ts`
- `apps/backend/src/auth/controllers/email-verification.controller.ts`
- `apps/backend/src/auth/controllers/index.ts`
- `apps/backend/src/auth/auth.controller.ts` (update to register email verification)
- `apps/backend/src/auth/auth.module.ts`
- `apps/backend/src/auth/auth.service.ts`
- `apps/backend/src/auth/auth.repository.ts`

**Actions:**
1. **GoogleOAuthController**
   - `@Get('google') @UseGuards(AuthGuard('google'))` — redirects to Google.
   - `@Get('google/callback') @UseGuards(AuthGuard('google'))`:
     - Get `req.user` payload.
     - Call `AuthService.finishOAuthLogin(user, req.ip, req.headers['user-agent'], res)`.
2. **EmailVerificationController**
   - `@Post('email/verify')` with `VerifyEmailDto { @IsString(), @IsNotEmpty() token }` → `EmailVerificationService.verifyEmail`.
   - `@Post('email/resend')` with `ResendVerificationDto { @IsEmail() email }` → `EmailVerificationService.resendVerification`.
   - `@Get('email/verify')` reads `?token=`, calls `EmailVerificationService.verifyEmail`, then 302 redirects to `successUrl` on success or `failureUrl?error=` on failure.
3. **AuthService** additions:
   - `finishOAuthLogin(user, ip?, ua?, response?)` — creates refresh token + session, signs access token, writes refresh cookie, returns `AuthResponseDto`.
   - `login` rejects unverified users with `ForbiddenException` when `emailVerification.required` is `true`.
   - `register` creates user with `status: 'PENDING_VERIFICATION'` and `emailVerified: false`, then calls `EmailVerificationService.sendVerification`.
4. **AuthRepository** update:
   - `create` sets `status: 'PENDING_VERIFICATION'`, `emailVerified: false`.
5. **AuthModule** wiring:
   - Import `PassportModule.register({ defaultStrategy: 'google' })`.
   - Provide repositories, services, `GoogleStrategy`, `ConsoleEmailTransportService`, `EmailTransport` token, `AuthAuditService`.
   - Register `GoogleOAuthController`, `EmailVerificationController`, and update `AuthController`.
   - Export `JwtAuthGuard` and `CurrentUser` unchanged.

**Acceptance criteria:**
- `GET /api/auth/google`, `/api/auth/google/callback` mapped.
- `POST /api/auth/email/verify`, `/api/auth/email/resend` mapped.
- `GET /api/auth/email/verify?token=` maps and redirects.
- OAuth callback returns `AuthResponseDto` and sets refresh cookie.

**Complexity:** simple

---

## Chunk 6 — Register integration and tests
**Files:**
- `apps/backend/src/auth/auth.service.spec.ts` (update for PENDING_VERIFICATION and verification gating)
- `apps/backend/src/auth/services/email-verification.service.spec.ts`
- `apps/backend/src/auth/services/google-oauth.service.spec.ts`
- `apps/backend/test/oauth.e2e.spec.ts`
- `apps/backend/test/email-verification.e2e.spec.ts`

**Actions:**
1. Update `auth.service.spec.ts` to reflect new register status and login gating.
2. Unit tests for `EmailVerificationService` and `GoogleOAuthService`.
3. E2E tests:
   - **OAuth E2E**: override `GoogleStrategy` with a mock that returns a fake verified profile; call `/api/auth/google/callback`; assert new user creation, account linking for existing password user, duplicate login, and rejection of unverified Google email.
   - **Email verification E2E**: register creates user in `PENDING_VERIFICATION`; override `EmailTransport` with a spy to capture the raw token; call verify endpoint and assert `emailVerified=true` and `status=ACTIVE`; test resend invalidates old token, expired token returns 403, already-verified token returns 404, and unverified user cannot log in.
4. Ensure `bun test` passes for the full suite.

**Acceptance criteria:**
- All unit/integration/E2E tests pass.
- Full `bun test` returns green.

**Complexity:** simple

---

## Chunk 7 — Verification
After all chunks:
1. `cd /mnt/d/chronicle-your-media-story-mainzipzip/apps/backend && bun run format`
2. `bun run lint`
3. `bun run build`
4. `bun test`

Fix every issue before finishing.

---

## Flow Summaries

### Google OAuth flow
1. `GET /api/auth/google` → `AuthGuard('google')` redirects to Google with `state` parameter.
2. User consents on Google.
3. `GET /api/auth/google/callback` → Passport validates code, fetches profile.
4. `GoogleStrategy.validate` rejects if Google email is not verified.
5. `GoogleOAuthService.validateOrCreate(profile)` checks existing `OAuthAccount`, then existing `User` by email to link or create.
6. `AuthService.finishOAuthLogin` issues access token, creates refresh token/session, and sets HTTP-only `refresh_token` cookie.
7. Response returns `AuthResponseDto`.

### Account linking flow
1. A password user already exists with `alice@example.com`.
2. Alice logs in via Google using the same email and a verified Google account.
3. `GoogleOAuthService` finds the existing user, creates an `OAuthAccount` row for Google, writes `AuditLog(action: OAUTH_LINK)`.
4. Subsequent Google logins find the linked `OAuthAccount` and log in directly.
5. No duplicate `User` is created; unverified Google emails are rejected.

### Email verification flow
1. On register, `AuthService` creates the user with `status: 'PENDING_VERIFICATION'` and calls `EmailVerificationService.sendVerification`.
2. A raw token is generated and a SHA-256 hash stored in `EmailVerificationToken` with expiry; previous unverified tokens are invalidated.
3. The `EmailTransport` sends/logs a link: `{baseUrl}/auth/email/verify?token={raw}`.
4. User clicks link (`GET /api/auth/email/verify?token=`) or calls `POST /api/auth/email/verify` with `{ token }`.
5. Service hashes token, finds row, checks expiry, marks token `verifiedAt`, updates user `emailVerified=true`, `status=ACTIVE`, writes `AuditLog(action: EMAIL_VERIFIED)`.
6. `POST /api/auth/email/resend` accepts `{ email }`, finds the pending user, invalidates previous unverified tokens, and sends a new one.
7. Unverified users cannot log in while `EMAIL_VERIFICATION_REQUIRED=true`.

---

## Security Notes
- OAuth `state: true` in `GoogleStrategy` provides CSRF/replay protection.
- Google account linking is only allowed when Google's email is verified.
- Verification tokens are hashed before storage; raw tokens are only exposed via the transport/link.
- Expired tokens return `403`; missing/already-used tokens return `404` to avoid enumeration.
- Unverified users are blocked from login when verification is required.
- Existing refresh-token rotation, HTTP-only cookies, and session invalidation from Phase 06C are reused unchanged.
- Audit logs record `EMAIL_VERIFIED`, `OAUTH_LINK`, and OAuth sign-up `CREATE`; security events record `EMAIL_VERIFICATION_SENT`.
- All errors are mapped to business exceptions; no raw Prisma errors leak.
