import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { AuthSession } from '../models/auth.models';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  const apiBaseUrl = 'https://localhost:7008/api/auth';
  const authSession: AuthSession = {
    userId: 1,
    firstName: 'Amit',
    lastName: 'Kumar',
    email: 'amit@example.com',
    isEmailVerified: false,
    token: 'jwt-token',
    refreshToken: 'refresh-token',
    tokenExpiry: '2099-03-31T10:00:00Z'
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should call register endpoint and save the session', () => {
    let response: AuthSession | undefined;

    service
      .registerUser({
        firstName: 'Amit',
        lastName: 'Kumar',
        email: 'amit@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      })
      .subscribe((session) => {
        response = session;
      });

    const request = httpTestingController.expectOne(`${apiBaseUrl}/register`);
    expect(request.request.method).toBe('POST');
    request.flush(authSession);

    expect(response?.email).toBe('amit@example.com');
    expect(service.getLoggedInUser()?.token).toBe('jwt-token');
  });

  it('should call login endpoint and save the session', () => {
    let response: AuthSession | undefined;

    service
      .loginUser({
        email: 'amit@example.com',
        password: 'password123'
      })
      .subscribe((session) => {
        response = session;
      });

    const request = httpTestingController.expectOne(`${apiBaseUrl}/login`);
    expect(request.request.method).toBe('POST');
    request.flush(authSession);

    expect(response?.token).toBe('jwt-token');
    expect(service.getLoggedInUser()?.email).toBe('amit@example.com');
  });

  it('should call forgot password endpoint', () => {
    let responseMessage = '';

    service.forgotPassword('amit@example.com').subscribe((message) => {
      responseMessage = message;
    });

    const request = httpTestingController.expectOne(`${apiBaseUrl}/forgot-password`);
    expect(request.request.method).toBe('POST');
    request.flush({ message: 'Password reset email sent.' });

    expect(responseMessage).toBe('Password reset email sent.');
  });

  it('should call reset password endpoint', () => {
    let responseMessage = '';

    service
      .resetPassword({
        token: 'reset-token',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123'
      })
      .subscribe((message) => {
        responseMessage = message;
      });

    const request = httpTestingController.expectOne(`${apiBaseUrl}/reset-password`);
    expect(request.request.method).toBe('POST');
    request.flush({ message: 'Password reset successfully.' });

    expect(responseMessage).toBe('Password reset successfully.');
  });

  it('should call change password endpoint with authorization header', () => {
    localStorage.setItem('fundooAuthSession', JSON.stringify(authSession));
    let responseMessage = '';

    service
      .changePassword({
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123'
      })
      .subscribe((message) => {
        responseMessage = message;
      });

    const request = httpTestingController.expectOne(`${apiBaseUrl}/change-password`);
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    request.flush({ message: 'Password changed successfully.' });

    expect(responseMessage).toBe('Password changed successfully.');
  });

  it('should call resend verification endpoint', () => {
    let responseMessage = '';

    service.resendVerification('amit@example.com').subscribe((message) => {
      responseMessage = message;
    });

    const request = httpTestingController.expectOne(`${apiBaseUrl}/resend-verification`);
    expect(request.request.method).toBe('POST');
    request.flush({ message: 'Verification email sent.' });

    expect(responseMessage).toBe('Verification email sent.');
  });

  it('should verify email and update the local session', () => {
    localStorage.setItem('fundooAuthSession', JSON.stringify(authSession));
    let responseMessage = '';

    service.verifyEmail('verify-token').subscribe((message) => {
      responseMessage = message;
    });

    const request = httpTestingController.expectOne(
      `${apiBaseUrl}/verify-email?token=verify-token`
    );
    expect(request.request.method).toBe('GET');
    request.flush({ message: 'Email verified successfully.' });

    expect(responseMessage).toBe('Email verified successfully.');
    expect(service.getLoggedInUser()?.isEmailVerified).toBe(true);
  });

  it('should refresh the current session', () => {
    localStorage.setItem('fundooAuthSession', JSON.stringify(authSession));
    let response: AuthSession | undefined;

    service.refreshSession().subscribe((session) => {
      response = session;
    });

    const request = httpTestingController.expectOne(`${apiBaseUrl}/refresh-token`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body.refreshToken).toBe('refresh-token');

    const refreshedSession = {
      ...authSession,
      token: 'new-jwt-token'
    };

    request.flush(refreshedSession);

    expect(response?.token).toBe('new-jwt-token');
    expect(service.getLoggedInUser()?.token).toBe('new-jwt-token');
  });

  it('should call logout endpoint and clear the local session', () => {
    localStorage.setItem('fundooAuthSession', JSON.stringify(authSession));
    let responseMessage = '';

    service.logoutUser(true).subscribe((message) => {
      responseMessage = message;
    });

    const request = httpTestingController.expectOne(`${apiBaseUrl}/logout`);
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    expect(request.request.body.logoutAllDevices).toBe(true);
    request.flush({ message: 'Logged out from all devices.' });

    expect(responseMessage).toBe('Logged out from all devices.');
    expect(service.getLoggedInUser()).toBeNull();
  });

  it('should report login state from saved session', () => {
    localStorage.setItem('fundooAuthSession', JSON.stringify(authSession));

    expect(service.isLoggedIn()).toBe(true);
    expect(service.getAccessToken()).toBe('jwt-token');
    expect(service.getRefreshToken()).toBe('refresh-token');
  });
});
