# Phase 06B Shared Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build reusable `CommonModule`, `CoreModule`, and `SharedModule` with all requested abstractions, fully wired into the NestJS backend.

**Architecture:** Three modules under `apps/backend/src`. `CommonModule` exports framework helpers. `CoreModule` exports domain-building blocks and runtime abstractions. `SharedModule` re-exports both for single-import consumption by feature modules.

**Tech Stack:** NestJS 11, TypeScript 5.7, class-validator, class-transformer, Node crypto.

---

## File Structure

Create or modify files under `apps/backend/src`:

- `src/common/exceptions/` — business, not-found, conflict, forbidden, validation exceptions + index
- `src/common/result/` — `Result<T,E>`, `Either<L,R>`
- `src/common/pagination/` — cursor/offset pagination helpers + sort/filter DTOs
- `src/common/response/` — `ApiResponse<T>` helper + `BaseResponseDto<T>`
- `src/common/retry/` — retry helper + policies
- `src/common/correlation/` — correlation id helper
- `src/common/common.module.ts` + `src/common/index.ts`
- `src/core/domain/` — domain event base, value object base, entity base, aggregate root base, repository interface
- `src/core/context/` — request context service + current user abstraction
- `src/core/audit/` — audit abstraction
- `src/core/clock/` — clock abstraction + implementation
- `src/core/uuid/` — uuid abstraction + implementation
- `src/core/hash/` — hashing abstraction + implementation
- `src/core/cache/` — cache abstraction
- `src/core/storage/` — storage abstraction
- `src/core/events/` — event publisher abstraction
- `src/core/idempotency/` — idempotency abstraction
- `src/core/transaction/` — transaction + unit-of-work abstractions
- `src/core/repository/` — `BaseRepository<T>`
- `src/core/core.module.ts` + `src/core/index.ts`
- `src/shared/shared.module.ts` + `src/shared/index.ts`
- `src/app.module.ts` — import `SharedModule`

---

## Task 1: CommonModule exceptions

**Files:**

- Create: `src/common/exceptions/business.exception.ts`
- Create: `src/common/exceptions/not-found.exception.ts`
- Create: `src/common/exceptions/conflict.exception.ts`
- Create: `src/common/exceptions/forbidden.exception.ts`
- Create: `src/common/exceptions/validation.exception.ts`
- Create: `src/common/exceptions/index.ts`

- [ ] **Step 1.1: Write BusinessException**

```typescript
export class BusinessException extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

- [ ] **Step 1.2: Write NotFoundException**

```typescript
import { BusinessException } from "./business.exception";

export class NotFoundException extends BusinessException {
  constructor(message: string, code = "NOT_FOUND") {
    super(message, code, 404);
  }
}
```

- [ ] **Step 1.3: Write ConflictException**

```typescript
import { BusinessException } from "./business.exception";

export class ConflictException extends BusinessException {
  constructor(message: string, code = "CONFLICT") {
    super(message, code, 409);
  }
}
```

- [ ] **Step 1.4: Write ForbiddenException**

```typescript
import { BusinessException } from "./business.exception";

export class ForbiddenException extends BusinessException {
  constructor(message: string, code = "FORBIDDEN") {
    super(message, code, 403);
  }
}
```

- [ ] **Step 1.5: Write ValidationException**

```typescript
import { BusinessException } from "./business.exception";

export class ValidationException extends BusinessException {
  public readonly errors?: Record<string, string[]>;

  constructor(message: string, errors?: Record<string, string[]>, code = "VALIDATION_ERROR") {
    super(message, code, 400);
    this.errors = errors;
  }
}
```

- [ ] **Step 1.6: Write barrel index**

```typescript
export * from "./business.exception";
export * from "./not-found.exception";
export * from "./conflict.exception";
export * from "./forbidden.exception";
export * from "./validation.exception";
```

---

## Task 2: Result and Either

**Files:**

- Create: `src/common/result/result.ts`
- Create: `src/common/result/either.ts`
- Create: `src/common/result/index.ts`

- [ ] **Step 2.1: Write Result<T,E>**

```typescript
export class Result<T, E = Error> {
  private constructor(
    private readonly ok: boolean,
    private readonly value?: T,
    private readonly error?: E,
  ) {}

  static success<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  static failure<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  isSuccess(): boolean {
    return this.ok;
  }

  isFailure(): boolean {
    return !this.ok;
  }

  getValue(): T {
    if (!this.ok) {
      throw new Error("Cannot get value from a failed result");
    }
    return this.value as T;
  }

  getError(): E {
    if (this.ok) {
      throw new Error("Cannot get error from a successful result");
    }
    return this.error as E;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return this.ok
      ? Result.success<U, E>(fn(this.value as T))
      : Result.failure<U, E>(this.error as E);
  }

  mapError<F>(fn: (error: E) => F): Result<T, F> {
    return this.ok
      ? Result.success<T, F>(this.value as T)
      : Result.failure<T, F>(fn(this.error as E));
  }

  fold<U>(onSuccess: (value: T) => U, onFailure: (error: E) => U): U {
    return this.ok ? onSuccess(this.value as T) : onFailure(this.error as E);
  }
}
```

- [ ] **Step 2.2: Write Either<L,R>**

```typescript
export class Either<L, R> {
  private constructor(
    private readonly isRight: boolean,
    private readonly left?: L,
    private readonly right?: R,
  ) {}

  static left<L, R>(value: L): Either<L, R> {
    return new Either<L, R>(false, value, undefined);
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either<L, R>(true, undefined, value);
  }

  isLeft(): boolean {
    return !this.isRight;
  }

  isRight(): boolean {
    return this.isRight;
  }

  getLeft(): L {
    if (this.isRight) {
      throw new Error("Cannot get left from a right either");
    }
    return this.left as L;
  }

  getRight(): R {
    if (!this.isRight) {
      throw new Error("Cannot get right from a left either");
    }
    return this.right as R;
  }

  map<U>(fn: (value: R) => U): Either<L, U> {
    return this.isRight
      ? Either.right<L, U>(fn(this.right as R))
      : Either.left<L, U>(this.left as L);
  }

  mapLeft<U>(fn: (value: L) => U): Either<U, R> {
    return this.isRight
      ? Either.right<U, R>(this.right as R)
      : Either.left<U, R>(fn(this.left as L));
  }

  fold<U>(onLeft: (value: L) => U, onRight: (value: R) => U): U {
    return this.isRight ? onRight(this.right as R) : onLeft(this.left as L);
  }
}
```

- [ ] **Step 2.3: Write barrel index**

```typescript
export * from "./result";
export * from "./either";
```

---

## Task 3: Pagination helpers and DTOs

**Files:**

- Create: `src/common/pagination/offset-pagination.ts`
- Create: `src/common/pagination/cursor-pagination.ts`
- Create: `src/common/pagination/sort.dto.ts`
- Create: `src/common/pagination/filter.dto.ts`
- Create: `src/common/pagination/index.ts`

- [ ] **Step 3.1: Write offset-pagination.ts**

```typescript
import { IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class OffsetPaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 20;
}

export interface OffsetPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OffsetPaginated<T> {
  data: T[];
  meta: OffsetPaginationMeta;
}

export function buildOffsetMeta(page: number, limit: number, total: number): OffsetPaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
```

- [ ] **Step 3.2: Write cursor-pagination.ts**

```typescript
import { IsOptional, IsString } from "class-validator";

export class CursorPaginationDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  limit = 20;
}

export interface CursorPaginationMeta<T> {
  nextCursor?: string;
  hasMore: boolean;
  data: T[];
}

export interface CursorEncoder<T> {
  encode(cursor: T): string;
  decode(cursor: string): T;
}

export function buildCursorMeta<T>(
  items: T[],
  encode: (item: T) => string,
  limit: number,
): CursorPaginationMeta<T> {
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? encode(items[limit]) : undefined;
  return { data, hasMore, nextCursor };
}
```

- [ ] **Step 3.3: Write sort.dto.ts**

```typescript
import { IsIn, IsOptional, IsString } from "class-validator";

export class SortDto {
  @IsOptional()
  @IsString()
  sortBy = "createdAt";

  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder: "asc" | "desc" = "desc";
}
```

- [ ] **Step 3.4: Write filter.dto.ts**

```typescript
import { IsOptional, IsString } from "class-validator";

export class BaseFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}
```

- [ ] **Step 3.5: Write barrel index**

```typescript
export * from "./offset-pagination";
export * from "./cursor-pagination";
export * from "./sort.dto";
export * from "./filter.dto";
```

---

## Task 4: Response helpers

**Files:**

- Create: `src/common/response/base-response.dto.ts`
- Create: `src/common/response/api-response.helper.ts`
- Create: `src/common/response/index.ts`

- [ ] **Step 4.1: Write base-response.dto.ts**

```typescript
export class BaseResponseDto<T> {
  data: T;
  requestId?: string;
  timestamp = new Date().toISOString();
}
```

- [ ] **Step 4.2: Write api-response.helper.ts**

```typescript
import { BaseResponseDto } from "./base-response.dto";

export class ApiResponse {
  static success<T>(data: T, requestId?: string): BaseResponseDto<T> {
    return {
      data,
      requestId,
      timestamp: new Date().toISOString(),
    };
  }
}
```

- [ ] **Step 4.3: Write barrel index**

```typescript
export * from "./base-response.dto";
export * from "./api-response.helper";
```

---

## Task 5: Retry helpers

**Files:**

- Create: `src/common/retry/retry.policy.ts`
- Create: `src/common/retry/retry.helper.ts`
- Create: `src/common/retry/index.ts`

- [ ] **Step 5.1: Write retry.policy.ts**

```typescript
export interface RetryPolicy {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier?: number;
  maxDelayMs?: number;
  retryable?: (error: unknown) => boolean;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  delayMs: 100,
  backoffMultiplier: 2,
  maxDelayMs: 5000,
  retryable: () => true,
};

export const NO_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 1,
  delayMs: 0,
};
```

- [ ] **Step 5.2: Write retry.helper.ts**

```typescript
import { RetryPolicy, DEFAULT_RETRY_POLICY } from "./retry.policy";

export async function retry<T>(
  fn: () => Promise<T>,
  policy: RetryPolicy = DEFAULT_RETRY_POLICY,
): Promise<T> {
  let lastError: unknown;
  let delay = policy.delayMs;

  for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const shouldRetry = policy.retryable?.(error) ?? true;
      if (!shouldRetry || attempt === policy.maxAttempts) {
        throw error;
      }
      await sleep(delay);
      delay = calculateNextDelay(delay, policy);
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateNextDelay(currentDelay: number, policy: RetryPolicy): number {
  if (!policy.backoffMultiplier) return currentDelay;
  const next = currentDelay * policy.backoffMultiplier;
  return policy.maxDelayMs ? Math.min(next, policy.maxDelayMs) : next;
}
```

- [ ] **Step 5.3: Write barrel index**

```typescript
export * from "./retry.policy";
export * from "./retry.helper";
```

---

## Task 6: Correlation helper

**Files:**

- Create: `src/common/correlation/correlation-id.helper.ts`
- Create: `src/common/correlation/index.ts`

- [ ] **Step 6.1: Write correlation-id.helper.ts**

```typescript
import { randomUUID } from "crypto";

export function generateCorrelationId(): string {
  return randomUUID();
}
```

- [ ] **Step 6.2: Write barrel index**

```typescript
export * from "./correlation-id.helper";
```

---

## Task 7: CommonModule

**Files:**

- Create: `src/common/common.module.ts`
- Create: `src/common/index.ts`

- [ ] **Step 7.1: Write common.module.ts**

```typescript
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class CommonModule {}
```

- [ ] **Step 7.2: Write barrel index**

```typescript
export * from "./exceptions";
export * from "./result";
export * from "./pagination";
export * from "./response";
export * from "./retry";
export * from "./correlation";
export * from "./common.module";
```

---

## Task 8: Core domain base classes

**Files:**

- Create: `src/core/domain/domain-event.base.ts`
- Create: `src/core/domain/value-object.base.ts`
- Create: `src/core/domain/entity.base.ts`
- Create: `src/core/domain/aggregate-root.base.ts`
- Create: `src/core/domain/repository.interface.ts`
- Create: `src/core/domain/index.ts`

- [ ] **Step 8.1: Write domain-event.base.ts**

```typescript
export abstract class DomainEvent {
  public readonly occurredAt: Date;

  constructor(public readonly aggregateId: string) {
    this.occurredAt = new Date();
  }
}
```

- [ ] **Step 8.2: Write value-object.base.ts**

```typescript
export abstract class ValueObject<T> {
  protected constructor(protected readonly props: T) {}

  public equals(other: ValueObject<T>): boolean {
    if (this.constructor !== other.constructor) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }

  public getProps(): T {
    return this.props;
  }
}
```

- [ ] **Step 8.3: Write entity.base.ts**

```typescript
export abstract class Entity<T extends { id: string }> {
  protected constructor(protected readonly props: T) {}

  get id(): string {
    return this.props.id;
  }

  public equals(other: Entity<T>): boolean {
    if (this.constructor !== other.constructor) return false;
    return this.props.id === other.props.id;
  }

  public getProps(): T {
    return this.props;
  }
}
```

- [ ] **Step 8.4: Write aggregate-root.base.ts**

```typescript
import { DomainEvent } from "./domain-event.base";

export abstract class AggregateRoot<T extends { id: string }> {
  private readonly domainEvents: DomainEvent[] = [];

  protected constructor(protected readonly props: T) {}

  get id(): string {
    return this.props.id;
  }

  public addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  public clearDomainEvents(): void {
    this.domainEvents.length = 0;
  }

  public equals(other: AggregateRoot<T>): boolean {
    if (this.constructor !== other.constructor) return false;
    return this.props.id === other.props.id;
  }

  public getProps(): T {
    return this.props;
  }
}
```

- [ ] **Step 8.5: Write repository.interface.ts**

```typescript
export interface RepositoryPort<T> {
  findById(id: string): Promise<T | null>;
  exists(id: string): Promise<boolean>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
```

- [ ] **Step 8.6: Write barrel index**

```typescript
export * from "./domain-event.base";
export * from "./value-object.base";
export * from "./entity.base";
export * from "./aggregate-root.base";
export * from "./repository.interface";
```

---

## Task 9: Core context, audit, clock, uuid, hash abstractions

**Files:**

- Create: `src/core/context/request-context.service.ts`
- Create: `src/core/context/current-user.interface.ts`
- Create: `src/core/context/index.ts`
- Create: `src/core/audit/audit.abstraction.ts`
- Create: `src/core/audit/index.ts`
- Create: `src/core/clock/clock.abstraction.ts`
- Create: `src/core/clock/system-clock.service.ts`
- Create: `src/core/clock/index.ts`
- Create: `src/core/uuid/uuid.abstraction.ts`
- Create: `src/core/uuid/uuid.service.ts`
- Create: `src/core/uuid/index.ts`
- Create: `src/core/hash/hashing.abstraction.ts`
- Create: `src/core/hash/hashing.service.ts`
- Create: `src/core/hash/index.ts`

- [ ] **Step 9.1: Write request-context.service.ts**

```typescript
import { Injectable, Scope } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";

export interface RequestContextData {
  requestId: string;
  correlationId?: string;
  userId?: string;
}

@Injectable({ scope: Scope.DEFAULT })
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<RequestContextData>();

  public run<T>(context: RequestContextData, fn: () => Promise<T>): Promise<T> {
    return this.storage.run(context, fn);
  }

  public get(): RequestContextData | undefined {
    return this.storage.getStore();
  }

  public getRequestId(): string | undefined {
    return this.get()?.requestId;
  }

  public getCorrelationId(): string | undefined {
    return this.get()?.correlationId;
  }

  public getUserId(): string | undefined {
    return this.get()?.userId;
  }
}
```

- [ ] **Step 9.2: Write current-user.interface.ts**

```typescript
export interface CurrentUser {
  userId: string;
  email?: string;
  roles?: string[];
}
```

- [ ] **Step 9.3: Write audit.abstraction.ts**

```typescript
export interface AuditInfo {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuditService {
  recordCreate(userId?: string): AuditInfo;
  recordUpdate(userId?: string, existing?: AuditInfo): AuditInfo;
}
```

- [ ] **Step 9.4: Write clock.abstraction.ts**

```typescript
export abstract class Clock {
  abstract now(): Date;
}
```

- [ ] **Step 9.5: Write system-clock.service.ts**

```typescript
import { Injectable } from "@nestjs/common";
import { Clock } from "./clock.abstraction";

@Injectable()
export class SystemClock extends Clock {
  now(): Date {
    return new Date();
  }
}
```

- [ ] **Step 9.6: Write uuid.abstraction.ts**

```typescript
export abstract class UuidGenerator {
  abstract generate(): string;
}
```

- [ ] **Step 9.7: Write uuid.service.ts**

```typescript
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { UuidGenerator } from "./uuid.abstraction";

@Injectable()
export class UuidService extends UuidGenerator {
  generate(): string {
    return randomUUID();
  }
}
```

- [ ] **Step 9.8: Write hashing.abstraction.ts**

```typescript
export abstract class HashingService {
  abstract hash(plain: string): Promise<string>;
  abstract compare(plain: string, hashed: string): Promise<boolean>;
}
```

- [ ] **Step 9.9: Write hashing.service.ts**

```typescript
import { Injectable } from "@nestjs/common";
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { HashingService } from "./hashing.abstraction";

@Injectable()
export class NodeCryptoHashingService extends HashingService {
  private readonly algorithm = "sha256";

  async hash(plain: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const hash = createHash(this.algorithm)
      .update(plain + salt)
      .digest("hex");
    return `${salt}:${hash}`;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    const [salt, hash] = hashed.split(":");
    if (!salt || !hash) return false;
    const computed = createHash(this.algorithm)
      .update(plain + salt)
      .digest("hex");
    const computedBuffer = Buffer.from(computed);
    const hashBuffer = Buffer.from(hash);
    if (computedBuffer.length !== hashBuffer.length) return false;
    return timingSafeEqual(computedBuffer, hashBuffer);
  }
}
```

- [ ] **Step 9.10: Write barrel indexes**

`src/core/context/index.ts`:

```typescript
export * from "./request-context.service";
export * from "./current-user.interface";
```

`src/core/audit/index.ts`:

```typescript
export * from "./audit.abstraction";
```

`src/core/clock/index.ts`:

```typescript
export * from "./clock.abstraction";
export * from "./system-clock.service";
```

`src/core/uuid/index.ts`:

```typescript
export * from "./uuid.abstraction";
export * from "./uuid.service";
```

`src/core/hash/index.ts`:

```typescript
export * from "./hashing.abstraction";
export * from "./hashing.service";
```

---

## Task 10: Core cache, storage, event publisher, idempotency abstractions

**Files:**

- Create: `src/core/cache/cache.abstraction.ts`
- Create: `src/core/cache/index.ts`
- Create: `src/core/storage/storage.abstraction.ts`
- Create: `src/core/storage/index.ts`
- Create: `src/core/events/event-publisher.abstraction.ts`
- Create: `src/core/events/index.ts`
- Create: `src/core/idempotency/idempotency.abstraction.ts`
- Create: `src/core/idempotency/index.ts`

- [ ] **Step 10.1: Write cache.abstraction.ts**

```typescript
export interface CacheService {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
}
```

- [ ] **Step 10.2: Write storage.abstraction.ts**

```typescript
export interface StorageFile {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
}

export interface StorageService {
  upload(path: string, file: StorageFile): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
}
```

- [ ] **Step 10.3: Write event-publisher.abstraction.ts**

```typescript
import { DomainEvent } from "../domain";

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
}
```

- [ ] **Step 10.4: Write idempotency.abstraction.ts**

```typescript
export interface IdempotencyService {
  checkOrStore(key: string, payloadHash: string): Promise<boolean>;
  markCompleted(key: string): Promise<void>;
}
```

- [ ] **Step 10.5: Write barrel indexes**

```typescript
// src/core/cache/index.ts
export * from "./cache.abstraction";

// src/core/storage/index.ts
export * from "./storage.abstraction";

// src/core/events/index.ts
export * from "./event-publisher.abstraction";

// src/core/idempotency/index.ts
export * from "./idempotency.abstraction";
```

---

## Task 11: Core transaction, unit-of-work, BaseRepository

**Files:**

- Create: `src/core/transaction/transaction.abstraction.ts`
- Create: `src/core/transaction/unit-of-work.abstraction.ts`
- Create: `src/core/transaction/index.ts`
- Create: `src/core/repository/base-repository.ts`
- Create: `src/core/repository/index.ts`

- [ ] **Step 11.1: Write transaction.abstraction.ts**

```typescript
export interface TransactionRunner {
  run<T>(fn: () => Promise<T>): Promise<T>;
}
```

- [ ] **Step 11.2: Write unit-of-work.abstraction.ts**

```typescript
import { DomainEvent } from "../domain";

export interface UnitOfWork {
  commit(): Promise<void>;
  rollback(): Promise<void>;
  addDomainEvents(events: DomainEvent[]): void;
}
```

- [ ] **Step 11.3: Write base-repository.ts**

```typescript
import { RepositoryPort } from "../domain";

export abstract class BaseRepository<T> implements RepositoryPort<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract exists(id: string): Promise<boolean>;
  abstract save(entity: T): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
```

- [ ] **Step 11.4: Write barrel indexes**

`src/core/transaction/index.ts`:

```typescript
export * from "./transaction.abstraction";
export * from "./unit-of-work.abstraction";
```

`src/core/repository/index.ts`:

```typescript
export * from "./base-repository";
```

---

## Task 12: CoreModule and barrel

**Files:**

- Create: `src/core/core.module.ts`
- Create: `src/core/index.ts`

- [ ] **Step 12.1: Write core.module.ts**

```typescript
import { Global, Module } from "@nestjs/common";
import { SystemClock } from "./clock";
import { UuidService } from "./uuid";
import { NodeCryptoHashingService } from "./hash";
import { RequestContextService } from "./context";

@Global()
@Module({
  providers: [SystemClock, UuidService, NodeCryptoHashingService, RequestContextService],
  exports: [SystemClock, UuidService, NodeCryptoHashingService, RequestContextService],
})
export class CoreModule {}
```

- [ ] **Step 12.2: Write core barrel index**

```typescript
export * from "./domain";
export * from "./context";
export * from "./audit";
export * from "./clock";
export * from "./uuid";
export * from "./hash";
export * from "./cache";
export * from "./storage";
export * from "./events";
export * from "./idempotency";
export * from "./transaction";
export * from "./repository";
export * from "./core.module";
```

---

## Task 13: SharedModule and barrel

**Files:**

- Create: `src/shared/shared.module.ts`
- Create: `src/shared/index.ts`

- [ ] **Step 13.1: Write shared.module.ts**

```typescript
import { Global, Module } from "@nestjs/common";
import { CommonModule } from "../common";
import { CoreModule } from "../core";

@Global()
@Module({
  imports: [CommonModule, CoreModule],
  exports: [CommonModule, CoreModule],
})
export class SharedModule {}
```

- [ ] **Step 13.2: Write shared barrel index**

```typescript
export * from "../common";
export * from "../core";
export * from "./shared.module";
```

---

## Task 14: Wire SharedModule into AppModule

**Files:**

- Modify: `src/app.module.ts`

- [ ] **Step 14.1: Import SharedModule**

```typescript
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { LoggerModule } from "./logger/logger.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { BullmqModule } from "./bullmq/bullmq.module";
import { HealthModule } from "./health/health.module";
import { SharedModule } from "./shared";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { validationPipe } from "./common/pipes/validation.pipe";

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    PrismaModule,
    RedisModule,
    BullmqModule,
    HealthModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: validationPipe,
    },
  ],
})
export class AppModule {}
```

---

## Task 15: Compilation and verification

- [ ] **Step 15.1: Format**

Run: `bun run format`
Expected: Prettier reformats all new files without errors.

- [ ] **Step 15.2: Lint**

Run: `bun run lint`
Expected: ESLint exits 0.

- [ ] **Step 15.3: Build**

Run: `bun run build`
Expected: NestJS TypeScript build exits 0.

- [ ] **Step 15.4: E2E test**

Run: `bun test ./test/app.e2e-spec.ts`
Expected: 3/3 tests pass.

- [ ] **Step 15.5: Commit**

```bash
git add apps/backend/src/common apps/backend/src/core apps/backend/src/shared apps/backend/src/app.module.ts
git commit -m "feat: add shared foundation abstractions (phase 06b)"
```
