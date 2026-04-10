import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { ResendVerification } from './resend-verification';

type AuthServiceMock = {
  resendVerification: ReturnType<typeof vi.fn>;
  getLoggedInUser: ReturnType<typeof vi.fn>;
};

describe('ResendVerification', () => {
  let component: ResendVerification;
  let fixture: ComponentFixture<ResendVerification>;
  let authService: AuthServiceMock;

  beforeEach(async () => {
    authService = {
      resendVerification: vi.fn(() => of('Verification email sent.')),
      getLoggedInUser: vi.fn(() => ({ email: 'asha@example.com' }))
    };

    await TestBed.configureTestingModule({
      imports: [ResendVerification],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResendVerification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prefill email from the current session when available', () => {
    expect(component.resendForm.controls.email.value).toBe('asha@example.com');
  });

  it('should call resend verification service on submit', () => {
    component.onSubmit();

    expect(authService.resendVerification).toHaveBeenCalledWith('asha@example.com');
    expect(component.successMessage).toBe('Verification email sent.');
  });
});
