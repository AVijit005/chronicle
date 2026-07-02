# Phase 06C-1 Authentication Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the email + password authentication foundation with register, login, refresh, logout, logout-all, and me endpoints.

**Architecture:** Single `AuthModule` under `src/auth/` containing controller, services, repository, DTOs, guards, and decorators. It consumes `PrismaModule` and `SharedModule`.

**Tech Stack:** NestJS, Prisma, argon2, @nestjs/jwt, cookie-parser.

---

## File Structure

```
src/auth/
  auth.module.ts
  auth.controller.ts
  auth.service.ts
  auth.repository.ts
  guards/
    jwt-auth.guard.ts
  decorators/
    current-user.decorator.ts
  dto/
    register.dto.ts
    login.dto.ts
    auth-response.dto.ts
    user-response.dto.ts
    refresh-access-token.dto.ts
  services/
    password.service.ts
    jwt-token.service.ts
    refresh-token.service.ts
    session.service.ts
    token.factory.ts
    cookie.service.ts
  test/
    auth.service.spec.ts
    password.service.spec.ts
    jwt-token.service.spec.ts
    token.factory.spec.ts
    cookie.service.spec.ts
```

---

## Task 1: Add dependencies

**Files:**

- Modify: `package.json`

- [ ] **Step 1.1: Add runtime and dev dependencies**

Add under `dependencies`:

```json
"@nestjs/jwt": "^11.0.0",
"argon2": "^0.41.0",
"cookie-parser": "^1.4.7"
```

Add under `devDependencies`:

```json
"@types/cookie-parser": "^1.4.7"
```

- [ ] **Step 1.2: Install**

Run: `bun install`
Expected: packages installed, lockfile updated.

---

## Task 2: Configure environment variables

**Files:**

- Modify: `src/config/env.validation.ts`
- Modify: `src/config/configuration.ts`

- [ ] **Step 2.1: Add env validation rules**

Add fields to the validation class:

```typescript
@IsString()
JWT_ACCESS_SECRET: string;

@IsString()
JWT_REFRESH_SECRET: string;

@IsOptional()
@IsInt()
@Min(1)
JWT_ACCESS_EXPIRY_SECONDS: number;

@IsOptional()
@IsInt()
@Min(1)
JWT_REFRESH_EXPIRY_SECONDS: number;

@IsOptional()
@IsInt()
@Min(1)
SESSION_TTL_SECONDS: number;

@IsOptional()
@IsString()
COOKIE_DOMAIN?: string;
```

- [ ] **Step 2.2: Add configuration values**

Add to `configuration.ts` return object:

```typescript
jwt: {
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpirySeconds: parseInt(process.env.JWT_ACCESS_EXPIRY_SECONDS || '900', 10),
  refreshExpirySeconds: parseInt(process.env.JWT_REFRESH_EXPIRY_SECONDS || '604800', 10),
},
session: {
  ttlSeconds: parseInt(process.env.SESSION_TTL_SECONDS || '604800', 10),
},
cookie: {
  domain: process.env.COOKIE_DOMAIN,
},
```

---

## Task 3: Enable cookie parsing in bootstrap

**Files:**

- Modify: `src/app.bootstrap.ts`

- [ ] **Step 3.1: Import and register cookie-parser middleware**

```typescript
import * as cookieParser from "cookie-parser";

// inside createApp, after helmet/compression
app.use(cookieParser());
```

---

## Task 4: Implement DTOs and response models

**Files:**

- Create: `src/auth/dto/register.dto.ts`
- Create: `src/auth/dto/login.dto.ts`
- Create: `src/auth/dto/refresh-access-token.dto.ts`
- Create: `src/auth/dto/user-response.dto.ts`
- Create: `src/auth/dto/auth-response.dto.ts`
- Create: `src/auth/dto/index.ts`

- [ ] **Step 4.1: RegisterDto**

```typescript
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}
```

- [ ] **Step 4.2: LoginDto**

```typescript
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

- [ ] **Step 4.3: RefreshAccessTokenDto**

```typescript
import { IsOptional, IsString } from "class-validator";

export class RefreshAccessTokenDto {
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
```

- [ ] **Step 4.4: UserResponseDto**

```typescript
export class UserResponseDto {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

- [ ] **Step 4.5: AuthResponseDto**

```typescript
import { UserResponseDto } from "./user-response.dto";

export class AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
}
```

- [ ] **Step 4.6: Barrel index**

```typescript
export * from "./register.dto";
export * from "./login.dto";
export * from "./refresh-access-token.dto";
export * from "./user-response.dto";
export * from "./auth-response.dto";
```

---

## Task 5: Implement TokenFactory

**Files:**

- Create: `src/auth/services/token.factory.ts`

- [ ] **Step 5.1: Implement token factory**

```typescript
import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";

@Injectable()
export class TokenFactory {
  generateSecureToken(length = 32): string {
    return randomBytes(length).toString("base64url");
  }
}
```

---

## Task 6: Implement CookieService

**Files:**

- Create: `src/auth/services/cookie.service.ts`
- Create: `src/auth/services/index.ts`

- [ ] **Step 6.1: Implement cookie service**

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response, Request } from "express";

export const REFRESH_TOKEN_COOKIE = "refresh_token";

@Injectable()
export class CookieService {
  constructor(private readonly config: ConfigService) {}

  writeRefreshToken(response: Response, token: string, maxAgeSeconds: number): void {
    const isProduction = this.config.get<string>("nodeEnv") === "production";
    response.cookie(REFRESH_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/api/auth",
      maxAge: maxAgeSeconds * 1000,
      domain: this.config.get<string>("cookie.domain") || undefined,
    });
  }

  readRefreshToken(request: Request): string | undefined {
    return request.cookies?.[REFRESH_TOKEN_COOKIE];
  }

  clearRefreshToken(response: Response): void {
    const isProduction = this.config.get<string>("nodeEnv") === "production";
    response.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/api/auth",
      domain: this.config.get<string>("cookie.domain") || undefined,
    });
  }
}
```

- [ ] **Step 6.2: Services barrel index**

```typescript
export * from "./token.factory";
export * from "./cookie.service";
export * from "./password.service";
export * from "./jwt-token.service";
export * from "./refresh-token.service";
export * from "./session.service";
```

---

## Task 7: Implement PasswordService

**Files:**

- Create: `src/auth/services/password.service.ts`

- [ ] **Step 7.1: Implement argon2id password service**

```typescript
import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";

@Injectable()
export class PasswordService {
  async hash(plain: string): Promise<string> {
    return argon2.hash(plain, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return argon2.verify(hashed, plain);
  }
}
```

---

## Task 8: Implement JwtTokenService

**Files:**

- Create: `src/auth/services/jwt-token.service.ts`

- [ ] **Step 8.1: Implement JWT wrapper**

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  expiresIn: number;
}

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  signAccessToken(payload: AccessTokenPayload): TokenPair {
    const expiresIn = this.config.get<number>("jwt.accessExpirySeconds") ?? 900;
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get<string>("jwt.accessSecret"),
      expiresIn,
    });
    return { accessToken, expiresIn };
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return this.jwt.verify<AccessTokenPayload>(token, {
      secret: this.config.get<string>("jwt.accessSecret"),
    });
  }
}
```

---

## Task 9: Implement AuthRepository

**Files:**

- Create: `src/auth/auth.repository.ts`

- [ ] **Step 9.1: Implement Prisma auth repository extending BaseRepository**

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { BaseRepository } from "../core";

@Injectable()
export class AuthRepository extends BaseRepository<User> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { id } });
    return count > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }

  async create(data: { email: string; passwordHash: string; name?: string | null }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name ?? null,
        status: "ACTIVE",
        emailVerified: false,
      },
    });
  }

  async save(entity: User): Promise<User> {
    return this.prisma.user.update({
      where: { id: entity.id },
      data: entity,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
```

---

## Task 10: Implement SessionService

**Files:**

- Create: `src/auth/services/session.service.ts`

- [ ] **Step 10.1: Implement session management**

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { Session, SessionStatus } from "@prisma/client";
import { TokenFactory } from "./token.factory";

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly tokenFactory: TokenFactory,
  ) {}

  async create(userId: string, ipAddress?: string, userAgent?: string): Promise<Session> {
    const ttlSeconds = this.config.get<number>("session.ttlSeconds") ?? 604800;
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    const token = this.tokenFactory.generateSecureToken();

    return this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
        status: "ACTIVE",
      },
    });
  }

  async validate(token: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({ where: { token } });
    if (!session) return null;
    if (session.status !== "ACTIVE") return null;
    if (session.expiresAt < new Date()) return null;
    if (session.deletedAt) return null;
    return session;
  }

  async invalidateByToken(token: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { token },
      data: { status: "REVOKED" },
    });
  }

  async invalidateAllForUser(userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId, status: "ACTIVE" },
      data: { status: "REVOKED" },
    });
  }
}
```

---

## Task 11: Implement RefreshTokenService

**Files:**

- Create: `src/auth/services/refresh-token.service.ts`

- [ ] **Step 11.1: Implement refresh token service**

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash } from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { RefreshToken } from "@prisma/client";
import { TokenFactory } from "./token.factory";

export interface RefreshTokenResult {
  token: string;
  refreshToken: RefreshToken;
}

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly tokenFactory: TokenFactory,
  ) {}

  async create(userId: string): Promise<RefreshTokenResult> {
    const token = this.tokenFactory.generateSecureToken();
    const tokenHash = this.hashToken(token);
    const expiresSeconds = this.config.get<number>("jwt.refreshExpirySeconds") ?? 604800;
    const expiresAt = new Date(Date.now() + expiresSeconds * 1000);

    const refreshToken = await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return { token, refreshToken };
  }

  async rotate(token: string): Promise<RefreshTokenResult> {
    const tokenHash = this.hashToken(token);
    const existing = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
      throw new ForbiddenException("Refresh token invalid or expired");
    }

    await this.prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revokedAt: new Date() },
    });

    return this.create(existing.userId);
  }

  async revoke(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
```

---

## Task 12: Implement JwtAuthGuard and CurrentUser decorator

**Files:**

- Create: `src/auth/guards/jwt-auth.guard.ts`
- Create: `src/auth/guards/index.ts`
- Create: `src/auth/decorators/current-user.decorator.ts`
- Create: `src/auth/decorators/index.ts`

- [ ] **Step 12.1: Implement guard**

```typescript
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtTokenService } from "../services/jwt-token.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing access token");
    }
    const token = authHeader.substring(7);
    try {
      request.user = this.jwtTokenService.verifyAccessToken(token);
      return true;
    } catch {
      throw new UnauthorizedException("Invalid access token");
    }
  }
}
```

- [ ] **Step 12.2: Implement decorator**

```typescript
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AccessTokenPayload } from "../services/jwt-token.service";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AccessTokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AccessTokenPayload;
  },
);
```

- [ ] **Step 12.3: Barrel indexes**

`src/auth/guards/index.ts`:

```typescript
export * from "./jwt-auth.guard";
```

`src/auth/decorators/index.ts`:

```typescript
export * from "./current-user.decorator";
```

---

## Task 13: Implement AuthService

**Files:**

- Create: `src/auth/auth.service.ts`

- [ ] **Step 13.1: Implement auth orchestrator**

High-level operations:

- `register(dto)` checks email uniqueness, hashes password, creates user, returns `UserResponseDto`.
- `login(dto, ip, ua)` fetches user by email, verifies password, updates last login, creates session, creates refresh token, issues access token, returns `AuthResponseDto`.
- `refresh(refreshToken, ip, ua)` validates session token, rotates refresh token, issues new access token, returns `AuthResponseDto`.
- `logout(refreshToken)` revokes refresh token and invalidates session.
- `logoutAll(userId)` revokes all refresh tokens and sessions for user.
- `me(userId)` returns `UserResponseDto`.

Use domain exceptions from `src/common` (ConflictException, NotFoundException, ForbiddenException, ValidationException, BusinessException). Use `Result<T,E>` where appropriate internally. Map all Prisma errors to domain exceptions.

---

## Task 14: Implement AuthController

**Files:**

- Create: `src/auth/auth.controller.ts`

- [ ] **Step 14.1: Implement controller**

```typescript
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(dto);
  }

  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.login(
      dto,
      request.ip,
      request.headers["user-agent"] as string | undefined,
      response,
    );
  }

  @Post("refresh")
  async refresh(
    @Body() dto: RefreshAccessTokenDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const refreshToken = dto.refreshToken || request.cookies?.refresh_token;
    return this.authService.refresh(
      refreshToken,
      request.ip,
      request.headers["user-agent"] as string | undefined,
      response,
    );
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const refreshToken = request.cookies?.refresh_token;
    await this.authService.logout(refreshToken, response);
  }

  @Post("logout-all")
  @UseGuards(JwtAuthGuard)
  async logoutAll(
    @CurrentUser() user: AccessTokenPayload,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logoutAll(user.sub, response);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AccessTokenPayload): Promise<UserResponseDto> {
    return this.authService.me(user.sub);
  }
}
```

---

## Task 15: Implement AuthModule

**Files:**

- Create: `src/auth/auth.module.ts`

- [ ] **Step 15.1: Wire module**

```typescript
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { SharedModule } from "../shared";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import {
  PasswordService,
  JwtTokenService,
  RefreshTokenService,
  SessionService,
  TokenFactory,
  CookieService,
} from "./services";

@Module({
  imports: [PrismaModule, SharedModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    PasswordService,
    JwtTokenService,
    RefreshTokenService,
    SessionService,
    TokenFactory,
    CookieService,
  ],
  exports: [JwtTokenService],
})
export class AuthModule {}
```

---

## Task 16: Wire AuthModule into AppModule

**Files:**

- Modify: `src/app.module.ts`

- [ ] **Step 16.1: Import AuthModule**

Add `AuthModule` to the imports array.

---

## Task 17: Add environment example values

**Files:**

- Modify: `apps/backend/.env.example`

- [ ] **Step 17.1: Add auth env vars**

```bash
JWT_ACCESS_SECRET=change-me-access-secret
JWT_REFRESH_SECRET=change-me-refresh-secret
JWT_ACCESS_EXPIRY_SECONDS=900
JWT_REFRESH_EXPIRY_SECONDS=604800
SESSION_TTL_SECONDS=604800
COOKIE_DOMAIN=
```

---

## Task 18: Implement unit tests

**Files:**

- Create: `src/auth/services/password.service.spec.ts`
- Create: `src/auth/services/jwt-token.service.spec.ts`
- Create: `src/auth/services/token.factory.spec.ts`
- Create: `src/auth/services/cookie.service.spec.ts`

- [ ] **Step 18.1: PasswordService tests**

Test hashing returns argon2id hash and compare succeeds for correct password and fails for wrong password.

- [ ] **Step 18.2: JwtTokenService tests**

Use `@nestjs/testing` Test module with mocked `JwtService` and `ConfigService`. Verify sign and verify behavior.

- [ ] **Step 18.3: TokenFactory tests**

Verify generated tokens are unique and non-empty.

- [ ] **Step 18.4: CookieService tests**

Mock `Response` object and verify `cookie`/`clearCookie` called with correct options.

---

## Task 19: Implement integration tests

**Files:**

- Create: `src/auth/auth.service.spec.ts`

- [ ] **Step 19.1: AuthService integration tests**

Use `@nestjs/testing` with `PrismaService` mocked or use a test database. Test:

- register creates user
- login with valid credentials returns tokens
- login with invalid password throws
- refresh rotates token
- logout revokes token
- logout-all revokes all tokens
- me returns current user

---

## Task 20: Implement E2E tests

**Files:**

- Create: `test/auth.e2e-spec.ts`

- [ ] **Step 20.1: E2E test all endpoints**

Use `createApp()` from `src/app.bootstrap.ts`. Test:

- `POST /api/auth/register` 201
- `POST /api/auth/login` 200 + sets refresh cookie
- `POST /api/auth/refresh` 200 + rotates cookie
- `GET /api/auth/me` 401 without token, 200 with token
- `POST /api/auth/logout` 200 clears cookie
- `POST /api/auth/logout-all` 200

---

## Task 21: Final verification

- [ ] **Step 21.1: Format**

Run: `bun run format`
Expected: no errors.

- [ ] **Step 21.2: Lint**

Run: `bun run lint`
Expected: no errors.

- [ ] **Step 21.3: Build**

Run: `bun run build`
Expected: exits 0.

- [ ] **Step 21.4: Tests**

Run: `bun test`
Expected: all tests pass.

- [ ] **Step 21.5: Commit**

```bash
git add apps/backend
git commit -m "feat: implement authentication foundation (phase 06c-1)"
```
