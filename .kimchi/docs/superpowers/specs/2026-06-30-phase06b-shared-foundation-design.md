# Phase 06B Shared Foundation Design

## Goal

Build a reusable shared infrastructure layer under `apps/backend/src` that every future feature module will depend on. No business features, no authentication, no media, no users.

## Architecture

The foundation is split into three NestJS modules with clear responsibilities:

- **`CommonModule`** — Framework-level helpers that can be imported anywhere: exceptions, `Result<T,E>`, pagination DTOs/helpers, correlation id helpers, retry helpers, base response DTO, `ApiResponse` helper.
- **`CoreModule`** — Domain-building blocks and runtime abstractions: domain events, value object/entity/aggregate root base classes, repository base interfaces, transaction & unit-of-work abstractions, request context, audit/clock/UUID/hash/cache/storage/event publisher/idempotency abstractions.
- **`SharedModule`** — Aggregates and re-exports `CommonModule` + `CoreModule` so feature modules import a single `SharedModule`.

All providers are injectable NestJS services or plain classes/interfaces. Plain interfaces are exported as TypeScript types and concrete abstractions are registered as providers where appropriate.

## Folder Organization

```
src/
  common/
    exceptions/
      business.exception.ts
      not-found.exception.ts
      conflict.exception.ts
      forbidden.exception.ts
      validation.exception.ts
      index.ts
    result/
      result.ts
      either.ts
    pagination/
      cursor-pagination.ts
      offset-pagination.ts
      sort.dto.ts
      filter.dto.ts
    response/
      api-response.helper.ts
      base-response.dto.ts
    retry/
      retry.helper.ts
      retry.policy.ts
    correlation/
      correlation-id.helper.ts
    common.module.ts
    index.ts
  core/
    domain/
      domain-event.base.ts
      value-object.base.ts
      entity.base.ts
      aggregate-root.base.ts
      repository.interface.ts
    context/
      request-context.service.ts
    audit/
      audit.abstraction.ts
    clock/
      clock.abstraction.ts
    uuid/
      uuid.abstraction.ts
    hash/
      hashing.abstraction.ts
    cache/
      cache.abstraction.ts
    storage/
      storage.abstraction.ts
    events/
      event-publisher.abstraction.ts
    idempotency/
      idempotency.abstraction.ts
    transaction/
      transaction.abstraction.ts
      unit-of-work.abstraction.ts
    repository/
      base-repository.ts
    core.module.ts
    index.ts
  shared/
    shared.module.ts
    index.ts
```

## Key Decisions

1. **No Prisma dependency in Core/Common.** Base repository uses generics; concrete Prisma repositories will be added in feature phases.
2. **No live external services.** Cache/storage/event publisher are abstract interfaces only; adapters (Redis, S3, BullMQ) are future work.
3. **`Result<T,E>` is primary.** Either pattern provided as a lightweight alternative only if justified by usage.
4. **Current User abstraction is a typed interface without JWT implementation.** It will be populated by auth middleware later.
5. **Pagination helpers are pure utilities + class-validator DTOs.** They do not depend on Prisma.
6. **Transaction/Unit-of-Work are interfaces.** Concrete implementation will wrap Prisma `$transaction` in feature phases.
7. **All modules are global or re-exported via `SharedModule`.** Feature modules import `SharedModule` only.

## Testing Strategy

- Unit tests for `Result<T,E>`, `Either`, pagination helpers, retry helper, and domain identity helpers.
- Compilation test via `bun run build`.
- Existing e2e test must still pass.

## Validation

- `bun run format`
- `bun run lint`
- `bun run build`
- `bun test ./test/app.e2e-spec.ts`
