import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AuthSession } from '../../models/auth.models';
import { AuthService } from '../../services/auth.service';
import { Login } from './login';

type AuthServiceMock = {
  registerUser: ReturnType<typeof vi.fn>;
  loginUser: ReturnType<typeof vi.fn>;
  logoutUser: ReturnType<typeof vi.fn>;
  forgotPassword: ReturnType<typeof vi.fn>;
  resetPassword: ReturnType<typeof vi.fn>;
  changePassword: ReturnType<typeof vi.fn>;
  resendVerification: ReturnType<typeof vi.fn>;
  verifyEmail: ReturnType<typeof vi.fn>;
  refreshSession: ReturnType<typeof vi.fn>;
  getLoggedInUser: ReturnType<typeof vi.fn>;
  isLoggedIn: ReturnType<typeof vi.fn>;
  getAccessToken: ReturnType<typeof vi.fn>;
  getRefreshToken: ReturnType<typeof vi.fn>;
};

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: AuthServiceMock;
  let router: Router;

  const authSession: AuthSession = {
    userId: 2,
    firstName: 'Riya',
    lastName: 'Shah',
    email: 'riya@example.com',
    isEmailVerified: false,
    token: 'jwt-token',
    refreshToken: 'refresh-token',
    tokenExpiry: '2026-03-31T10:00:00Z'
  };

  beforeEach(async () => {
    authService = {
      registerUser: vi.fn(),
      loginUser: vi.fn(),
      logoutUser: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      changePassword: vi.fn(),
      resendVerification: vi.fn(),
      verifyEmail: vi.fn(),
      refreshSession: vi.fn(),
      getLoggedInUser: vi.fn(),
      isLoggedIn: vi.fn(),
      getAccessToken: vi.fn(),
      getRefreshToken: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show backend error message when login fails', () => {
    vi.mocked(authService.loginUser).mockReturnValue(
      throwError(() => new Error('Invalid email or password.'))
    );

    component.loginForm.setValue({
      email: 'missing@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Invalid email or password.');
  });

  it('should login a valid user and navigate to notes', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    vi.mocked(authService.loginUser).mockReturnValue(of(authSession));

    component.loginForm.setValue({
      email: 'riya@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authService.loginUser).toHaveBeenCalledWith({
      email: 'riya@example.com',
      password: 'password123'
    });
    expect(navigateSpy).toHaveBeenCalledWith('/home/notes');
  });
});
