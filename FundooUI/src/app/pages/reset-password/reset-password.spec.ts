import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { ResetPassword } from './reset-password';

type AuthServiceMock = {
  resetPassword: ReturnType<typeof vi.fn>;
};

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;
  let authService: AuthServiceMock;

  beforeEach(async () => {
    authService = {
      resetPassword: vi.fn(() => of('Password reset successfully.'))
    };

    await TestBed.configureTestingModule({
      imports: [ResetPassword],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({
                token: 'token-from-email'
              })
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prefill token from query string', () => {
    expect(component.resetPasswordForm.controls.token.value).toBe('token-from-email');
  });

  it('should call reset password service on submit', () => {
    component.resetPasswordForm.setValue({
      token: 'token-from-email',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123'
    });

    component.onSubmit();

    expect(authService.resetPassword).toHaveBeenCalledWith({
      token: 'token-from-email',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123'
    });
    expect(component.successMessage).toBe('Password reset successfully.');
  });
});
