export type SessionStatus = 'active' | 'archived';

export type SessionSummary = {
  id: string;
  title: string;
  updatedAt: string;
  status: SessionStatus;
  preview?: string;
  parentSessionId?: string;
};
