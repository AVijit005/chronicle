/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WrappedRepository {
  constructor(private readonly prisma: PrismaService) {}

  private prismaAny(): Record<string, any> {
    return this.prisma as unknown as Record<string, any>;
  }

  async createWrappedYear(data: { userId: string; year: number; metadata?: any }): Promise<Record<string, any>> {
    const delegate = this.prismaAny().wrappedYear;
    if (!delegate) throw new Error('WrappedYear model not available');
    return delegate.create({ data });
  }

  async findWrappedYear(userId: string, year: number): Promise<Record<string, any> | null> {
    const delegate = this.prismaAny().wrappedYear;
    if (!delegate) return null;
    return delegate.findUnique({
      where: { userId_year: { userId, year } },
      include: { stats: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async findWrappedYearsByUserId(userId: string): Promise<Record<string, any>[]> {
    const delegate = this.prismaAny().wrappedYear;
    if (!delegate) return [];
    return delegate.findMany({
      where: { userId },
      orderBy: { year: 'desc' },
      include: { _count: { select: { stats: true } } },
    });
  }

  async updateWrappedYear(id: string, data: Record<string, any>): Promise<Record<string, any>> {
    const delegate = this.prismaAny().wrappedYear;
    if (!delegate) throw new Error('WrappedYear model not available');
    return delegate.update({ where: { id }, data });
  }

  async deleteWrappedYear(id: string, userId: string): Promise<boolean> {
    const delegate = this.prismaAny().wrappedYear;
    if (!delegate) return false;
    const existing = await delegate.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return false;
    await this.prismaAny().wrappedStat.deleteMany({ where: { wrappedYearId: id } });
    await delegate.delete({ where: { id } });
    return true;
  }

  async upsertStats(
    wrappedYearId: string,
    stats: Array<{ title: string; value: string; icon?: string; sortOrder: number }>,
  ): Promise<void> {
    const delegate = this.prismaAny().wrappedStat;
    if (!delegate) return;

    // Delete existing stats and recreate
    await delegate.deleteMany({ where: { wrappedYearId } });
    for (const stat of stats) {
      await delegate.create({
        data: {
          wrappedYearId,
          title: stat.title,
          value: stat.value,
          icon: stat.icon ?? null,
          sortOrder: stat.sortOrder,
        },
      });
    }
  }
}
