import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { VerifyEmail } from './verify-email';

type AuthServiceMock = {
  verifyEmail: ReturnType<typeof vi.fn>;
};

describe('VerifyEmail', () => {
  let component: VerifyEmail;
  let fixture: ComponentFixture<VerifyEmail>;
  let authService: AuthServiceMock;

  beforeEach(async () => {
    authService = {
      verifyEmail: vi.fn(() => of('Email verified successfully.'))
    };

    await TestBed.configureTestingModule({
      imports: [VerifyEmail],
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
                token: 'verify-token'
              })
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyEmail);
    component = fixture.componentInstance;
    component.ngOnInit();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify the token from the query string', () => {
    expect(authService.verifyEmail).toHaveBeenCalledWith('verify-token');
    expect(component.successMessage).toBe('Email verified successfully.');
  });
});
