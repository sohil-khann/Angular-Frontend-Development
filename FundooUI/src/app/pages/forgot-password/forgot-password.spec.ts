import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { ForgotPassword } from './forgot-password';

type AuthServiceMock = {
  forgotPassword: ReturnType<typeof vi.fn>;
};

describe('ForgotPassword', () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;
  let authService: AuthServiceMock;

  beforeEach(async () => {
    authService = {
      forgotPassword: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ForgotPassword],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call forgot password service on valid submit', () => {
    vi.mocked(authService.forgotPassword).mockReturnValue(of('Password reset email sent.'));

    component.forgotPasswordForm.setValue({
      email: 'asha@example.com'
    });

    component.onSubmit();

    expect(authService.forgotPassword).toHaveBeenCalledWith('asha@example.com');
    expect(component.successMessage).toBe('Password reset email sent.');
  });

  it('should show backend error message', () => {
    vi.mocked(authService.forgotPassword).mockReturnValue(
      throwError(() => new Error('Unable to send reset email.'))
    );

    component.forgotPasswordForm.setValue({
      email: 'asha@example.com'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Unable to send reset email.');
  });
});
