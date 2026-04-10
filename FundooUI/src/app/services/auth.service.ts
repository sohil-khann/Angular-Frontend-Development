import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { buildFriendlyError } from '../helpers/api-error.helper';
import {
  AuthSession,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest
} from '../models/auth.models';

interface ApiMessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBaseUrl = `${environment.apiUrl}/auth`;
  private readonly authSessionStorageKey = 'fundooAuthSession';

  constructor(private readonly httpClient: HttpClient) {}

  registerUser(userData: RegisterRequest): Observable<AuthSession> {
    return this.httpClient.post<AuthSession>(`${this.apiBaseUrl}/register`, userData).pipe(
      tap((session) => this.saveAuthSession(session)),
      catchError((error) =>
        this.throwFriendlyError(error, 'Unable to create your account right now.')
      )
    );
  }

  loginUser(loginData: LoginRequest): Observable<AuthSession> {
    return this.httpClient.post<AuthSession>(`${this.apiBaseUrl}/login`, loginData).pipe(
      tap((session) => this.saveAuthSession(session)),
      catchError((error) => this.throwFriendlyError(error, 'Unable to login right now.'))
    );
  }

  forgotPassword(email: string): Observable<string> {
    return this.httpClient
      .post<ApiMessageResponse>(`${this.apiBaseUrl}/forgot-password`, {
        email: email.trim().toLowerCase()
      })
      .pipe(
        map((response) => response.message),
        catchError((error) =>
          this.throwFriendlyError(error, 'Unable to send the password reset email right now.')
        )
      );
  }

  resetPassword(resetData: ResetPasswordRequest): Observable<string> {
    return this.httpClient
      .post<ApiMessageResponse>(`${this.apiBaseUrl}/reset-password`, resetData)
      .pipe(
        map((response) => response.message),
        catchError((error) =>
          this.throwFriendlyError(error, 'Unable to reset your password right now.')
        )
      );
  }

  changePassword(changeData: ChangePasswordRequest): Observable<string> {
    return this.httpClient
      .post<ApiMessageResponse>(`${this.apiBaseUrl}/change-password`, changeData)
      .pipe(
        map((response) => response.message),
        catchError((error) =>
          this.throwFriendlyError(error, 'Unable to change your password right now.')
        )
      );
  }

  resendVerification(email: string): Observable<string> {
    return this.httpClient
      .post<ApiMessageResponse>(`${this.apiBaseUrl}/resend-verification`, {
        email: email.trim().toLowerCase()
      })
      .pipe(
        map((response) => response.message),
        catchError((error) =>
          this.throwFriendlyError(error, 'Unable to resend the verification email right now.')
        )
      );
  }

  verifyEmail(token: string): Observable<string> {
    const params = new HttpParams().set('token', token);

    return this.httpClient.get<ApiMessageResponse>(`${this.apiBaseUrl}/verify-email`, { params }).pipe(
      tap(() => this.markEmailAsVerifiedLocally()),
      map((response) => response.message),
      catchError((error) => this.throwFriendlyError(error, 'Unable to verify your email right now.'))
    );
  }

  refreshSession(): Observable<AuthSession> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token is available. Please login again.'));
    }

    return this.httpClient
      .post<AuthSession>(`${this.apiBaseUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap((session) => this.saveAuthSession(session)),
        catchError((error) =>
          this.throwFriendlyError(error, 'Unable to refresh your session right now.')
        )
      );
  }

  logoutUser(logoutAllDevices = false): Observable<string> {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      this.clearAuthSession();
      return of('Logged out successfully.');
    }

    return this.httpClient
      .post<ApiMessageResponse>(
        `${this.apiBaseUrl}/logout`,
        { logoutAllDevices }
      )
      .pipe(
        map((response) => response.message),
        catchError((error) => {
          const fallbackMessage = logoutAllDevices
            ? 'Logged out locally. Please login again on your other devices if needed.'
            : 'Logged out locally.';
          return this.throwFriendlyError(error, fallbackMessage);
        }),
        finalize(() => this.clearAuthSession())
      );
  }

  getLoggedInUser(): AuthSession | null {
    const savedSession = localStorage.getItem(this.authSessionStorageKey);
    return savedSession ? (JSON.parse(savedSession) as AuthSession) : null;
  }

  isLoggedIn(): boolean {
    const session = this.getLoggedInUser();

    if (!session?.token) {
      return false;
    }

    return new Date(session.tokenExpiry).getTime() > Date.now();
  }

  getAccessToken(): string {
    return this.getLoggedInUser()?.token ?? '';
  }

  getRefreshToken(): string {
    return this.getLoggedInUser()?.refreshToken ?? '';
  }

  markEmailAsVerifiedLocally(): void {
    const savedSession = this.getLoggedInUser();

    if (!savedSession) {
      return;
    }

    this.saveAuthSession({
      ...savedSession,
      isEmailVerified: true
    });
  }

  private saveAuthSession(session: AuthSession): void {
    localStorage.setItem(this.authSessionStorageKey, JSON.stringify(session));
  }

  private clearAuthSession(): void {
    localStorage.removeItem(this.authSessionStorageKey);
  }
  private throwFriendlyError(error: unknown, fallbackMessage: string): Observable<never> {
    return throwError(() => buildFriendlyError(error, fallbackMessage));
  }
}
