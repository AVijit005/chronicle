import { Injectable } from '@nestjs/common';
import { EmailVerificationToken, Prisma } from '@prisma/client';
import { BaseRepository } from '../../core';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateEmailVerificationTokenData {
  userId: string;
  email: string;
  tokenHash: string;
  expiresAt: Date;
}

@Injectable()
export class EmailVerificationTokenRepository extends BaseRepository<EmailVerificationToken> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<EmailVerificationToken | null> {
    return this.prisma.emailVerificationToken.findUnique({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.emailVerificationToken.count({ where: { id } });
    return count > 0;
  }

  async save(entity: EmailVerificationToken): Promise<EmailVerificationToken> {
    const { id, ...rest } = entity;
    return this.prisma.emailVerificationToken.update({
      where: { id },
      data: rest as Prisma.EmailVerificationTokenUncheckedUpdateInput,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.emailVerificationToken.delete({ where: { id } });
  }

  async findByTokenHash(tokenHash: string): Promise<EmailVerificationToken | null> {
    return this.prisma.emailVerificationToken.findUnique({ where: { tokenHash } });
  }

  async create(data: CreateEmailVerificationTokenData): Promise<EmailVerificationToken> {
    return this.prisma.emailVerificationToken.create({
      data: {
        userId: data.userId,
        email: data.email,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  async markVerified(id: string): Promise<EmailVerificationToken> {
    return this.prisma.emailVerificationToken.update({
      where: { id },
      data: { verifiedAt: new Date() },
    });
  }

  async invalidatePreviousForUser(userId: string): Promise<{ count: number }> {
    const now = new Date();
    return this.prisma.emailVerificationToken.updateMany({
      where: {
        userId,
        verifiedAt: null,
        expiresAt: { gt: now },
      },
      data: { expiresAt: now },
    });
  }
}
