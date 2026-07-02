export class SessionResponseDto {
  id: string;
  browser: string | null;
  os: string | null;
  ipAddress: string | null;
  lastSeen: Date;
  isCurrent: boolean;
  status: string;
  createdAt: Date;
}
