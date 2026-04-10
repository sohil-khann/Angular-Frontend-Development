import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from '../gaurd/auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let router: Router;
  let authService: { isLoggedIn: () => boolean };

  beforeEach(() => {
    authService = {
      isLoggedIn: () => false
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    });

    router = TestBed.inject(Router);
  });

  it('should allow access when a user is logged in', () => {
    authService.isLoggedIn = () => true;

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toBe(true);
  });

  it('should redirect to login when a user is not logged in', () => {
    authService.isLoggedIn = () => false;

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
  });
});
