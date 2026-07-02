import { Injectable } from '@nestjs/common';
import { AuditAction, Prisma, SecurityEventType, SecuritySeverity } from '@prisma/client';
import { RequestContextService } from '../../core';
import { PrismaService } from '../../prisma/prisma.service';

export interface AuthAuditMetadata {
  correlationId?: string;
  ipAddress?: string;
  userAgent?: string;
  [key: string]: unknown;
}

@Injectable()
export class AuthAuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  async logAudit(
    action: AuditAction,
    userId: string | null,
    entityType: string,
    entityId: string | null,
    previousValue: unknown = null,
    newValue: unknown = null,
    metadata: AuthAuditMetadata = {},
  ): Promise<void> {
    const ctx = this.requestContext.get();
    const correlationId = metadata.correlationId ?? ctx?.correlationId ?? ctx?.requestId;
    const ipAddress = metadata.ipAddress ?? undefined;
    const userAgent = metadata.userAgent ?? undefined;

    const fullMetadata: Record<string, unknown> = { ...metadata };
    if (correlationId !== undefined) {
      fullMetadata.correlationId = correlationId;
    }

    await this.prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        entityType,
        entityId: entityId ?? null,
        previousValue: previousValue as Prisma.InputJsonValue,
        newValue: newValue as Prisma.InputJsonValue,
        metadata: fullMetadata as Prisma.InputJsonValue,
        ipAddress,
        userAgent,
      },
    });
  }

  async logSecurityEvent(
    userId: string | null,
    type: SecurityEventType,
    severity: SecuritySeverity,
    metadata: AuthAuditMetadata = {},
  ): Promise<void> {
    const ctx = this.requestContext.get();
    const correlationId = metadata.correlationId ?? ctx?.correlationId ?? ctx?.requestId;
    const ipAddress = metadata.ipAddress ?? undefined;
    const userAgent = metadata.userAgent ?? undefined;

    const fullMetadata: Record<string, unknown> = { ...metadata };
    if (correlationId !== undefined) {
      fullMetadata.correlationId = correlationId;
    }

    await this.prisma.securityEvent.create({
      data: {
        userId: userId ?? null,
        eventType: type,
        severity,
        metadata: fullMetadata as Prisma.InputJsonValue,
        ipAddress,
        userAgent,
      },
    });
  }
}
