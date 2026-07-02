import { Injectable } from '@nestjs/common';
import { OAuthAccount, OAuthProvider, Prisma } from '@prisma/client';
import { BaseRepository } from '../../core';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateOAuthAccountData {
  userId: string;
  provider: OAuthProvider;
  providerAccountId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  tokenType?: string | null;
  scope?: string | null;
  idToken?: string | null;
  expiresAt?: Date | null;
}

@Injectable()
export class OAuthAccountRepository extends BaseRepository<OAuthAccount> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<OAuthAccount | null> {
    return this.prisma.oAuthAccount.findUnique({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.oAuthAccount.count({ where: { id } });
    return count > 0;
  }

  async save(entity: OAuthAccount): Promise<OAuthAccount> {
    const { id, ...rest } = entity;
    return this.prisma.oAuthAccount.update({
      where: { id },
      data: rest as Prisma.OAuthAccountUncheckedUpdateInput,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.oAuthAccount.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findByProviderAndAccountId(provider: OAuthProvider, providerAccountId: string): Promise<OAuthAccount | null> {
    return this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });
  }

  async create(data: CreateOAuthAccountData): Promise<OAuthAccount> {
    return this.prisma.oAuthAccount.create({
      data: {
        userId: data.userId,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        accessToken: data.accessToken ?? null,
        refreshToken: data.refreshToken ?? null,
        tokenType: data.tokenType ?? null,
        scope: data.scope ?? null,
        idToken: data.idToken ?? null,
        expiresAt: data.expiresAt ?? null,
      },
    });
  }
}
