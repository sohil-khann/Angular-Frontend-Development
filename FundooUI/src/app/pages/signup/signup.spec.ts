import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AuthSession } from '../../models/auth.models';
import { AuthService } from '../../services/auth.service';
import { Signup } from './signup';

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

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let authService: AuthServiceMock;
  let router: Router;

  const authSession: AuthSession = {
    userId: 1,
    firstName: 'Asha',
    lastName: 'Patel',
    email: 'asha@example.com',
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
      imports: [Signup],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should block submit when passwords do not match', () => {
    component.signupForm.setValue({
      firstName: 'Asha',
      lastName: 'Patel',
      email: 'asha@example.com',
      password: 'password123',
      confirmPassword: 'different123'
    });

    component.onSubmit();

    expect(component.signupForm.hasError('passwordMismatch')).toBe(true);
    expect(authService.registerUser).not.toHaveBeenCalled();
  });

  it('should block submit when email is invalid', () => {
    component.signupForm.setValue({
      firstName: 'Asha',
      lastName: 'Patel',
      email: 'asha',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();

    expect(component.signupForm.controls.email.invalid).toBe(true);
    expect(authService.registerUser).not.toHaveBeenCalled();
  });

  it('should register a valid user and navigate to notes', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    vi.mocked(authService.registerUser).mockReturnValue(of(authSession));

    component.signupForm.setValue({
      firstName: 'Asha',
      lastName: 'Patel',
      email: 'asha@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();

    expect(authService.registerUser).toHaveBeenCalledWith({
      firstName: 'Asha',
      lastName: 'Patel',
      email: 'asha@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(navigateSpy).toHaveBeenCalledWith('/home/notes');
  });

  it('should show backend error message on registration failure', () => {
    vi.mocked(authService.registerUser).mockReturnValue(
      throwError(() => new Error('Email is already registered.'))
    );

    component.signupForm.setValue({
      firstName: 'Asha',
      lastName: 'Patel',
      email: 'asha@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();

    expect(component.submitMessage).toBe('Email is already registered.');
  });
});
