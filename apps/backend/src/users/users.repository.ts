import { Injectable } from '@nestjs/common';
import { Prisma, Session, User } from '@prisma/client';
import { BaseRepository } from '../core';
import { PrismaService } from '../prisma/prisma.service';
import { UserPreferences, UserPrivacy } from './users.types';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
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

  async save(entity: User): Promise<User> {
    const { id, ...rest } = entity;
    return this.prisma.user.update({
      where: { id },
      data: rest as Prisma.UserUncheckedUpdateInput,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findByIdWithProfile(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findByUsernameExcludingUserId(username: string, userId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { username, NOT: { id: userId } },
    });
  }

  async updateProfile(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: data as Prisma.UserUncheckedUpdateInput,
    });
  }

  async updatePreferences(id: string, data: UserPreferences): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { preferences: data as Prisma.InputJsonValue },
    });
  }

  async updatePrivacy(id: string, data: UserPrivacy): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { privacy: data as Prisma.InputJsonValue },
    });
  }

  async updateAvatar(id: string, url: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { avatar: url },
    });
  }

  async removeAvatar(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { avatar: null },
    });
  }

  async findSessionsByUserId(userId: string, now: Date): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        deletedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findSessionByIdAndUserId(sessionId: string, userId: string): Promise<Session | null> {
    return this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });
  }

  async revokeSession(sessionId: string, userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { id: sessionId, userId },
      data: { status: 'REVOKED', deletedAt: new Date() },
    });
  }
}
