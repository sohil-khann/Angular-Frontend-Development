export interface SessionInfoModel {
  sessionId: number;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
  isCurrentSession: boolean;
  isActive: boolean;
}

export interface UserSessionsModel {
  userId: number;
  email: string;
  sessions: SessionInfoModel[];
  activeSessionsCount: number;
}
