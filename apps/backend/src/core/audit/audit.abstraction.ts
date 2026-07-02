export interface AuditInfo {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuditService {
  recordCreate(userId?: string): AuditInfo;
  recordUpdate(userId?: string, existing?: AuditInfo): AuditInfo;
}
