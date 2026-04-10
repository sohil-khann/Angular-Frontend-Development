import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { ChangePassword } from './change-password';

type AuthServiceMock = {
  changePassword: ReturnType<typeof vi.fn>;
};

describe('ChangePassword', () => {
  let component: ChangePassword;
  let fixture: ComponentFixture<ChangePassword>;
  let authService: AuthServiceMock;

  beforeEach(async () => {
    authService = {
      changePassword: vi.fn(() => of('Password changed successfully.'))
    };

    await TestBed.configureTestingModule({
      imports: [ChangePassword],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call change password service on valid submit', () => {
    component.changePasswordForm.setValue({
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123'
    });

    component.onSubmit();

    expect(authService.changePassword).toHaveBeenCalledWith({
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123'
    });
    expect(component.successMessage).toBe('Password changed successfully.');
  });
});
