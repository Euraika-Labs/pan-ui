export type AuditEvent = {
  id: string;
  createdAt: string;
  action: string;
  targetType: string;
  targetId: string;
  detail: string;
  severity?: 'info' | 'warning' | 'critical';
};
