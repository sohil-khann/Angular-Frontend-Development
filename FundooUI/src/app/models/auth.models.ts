export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthSession {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  token: string;
  refreshToken: string;
  tokenExpiry: string;
}
