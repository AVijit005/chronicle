import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RequestContextService } from '../../core';
import { PrismaService } from '../../prisma/prisma.service';

export interface AuditLogMetadata {
  correlationId?: string;
  ipAddress?: string;
  userAgent?: string;
  [key: string]: unknown;
}

@Injectable()
export class UserAuditLogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  async logChange(
    userId: string,
    entityType: string,
    entityId: string,
    previousValue: unknown,
    newValue: unknown,
    metadata: AuditLogMetadata = {},
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
        userId,
        action: 'UPDATE',
        entityType,
        entityId,
        previousValue: previousValue as Prisma.InputJsonValue,
        newValue: newValue as Prisma.InputJsonValue,
        metadata: fullMetadata as Prisma.InputJsonValue,
        ipAddress,
        userAgent,
      },
    });
  }
}
