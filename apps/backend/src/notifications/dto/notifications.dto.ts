import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class NotificationResponseDto {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  actionUrl: string | null;
  image: string | null;
  createdAt: string;
  readAt: string | null;
}

export class NotificationPreferencesDto {
  emailEnabled: boolean;
  pushEnabled: boolean;
  browserEnabled: boolean;
  marketingEnabled: boolean;
  weeklyWrapped: boolean;
  monthlyReport: boolean;
  friendActivity: boolean;
  reminders: boolean;
}

export class UpdateNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  browserEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  marketingEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  weeklyWrapped?: boolean;

  @IsOptional()
  @IsBoolean()
  monthlyReport?: boolean;

  @IsOptional()
  @IsBoolean()
  friendActivity?: boolean;

  @IsOptional()
  @IsBoolean()
  reminders?: boolean;
}

export class NotificationListDto {
  items: NotificationResponseDto[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
  cursor: string | null;
}

export class TestNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  type?: string;
}
