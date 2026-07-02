import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../shared';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import {
  AvatarService,
  PreferencesService,
  PrivacyService,
  ProfileService,
  UserAgentParser,
  UserAuditLogService,
} from './services';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    ProfileService,
    PreferencesService,
    PrivacyService,
    AvatarService,
    UserAuditLogService,
    UserAgentParser,
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
