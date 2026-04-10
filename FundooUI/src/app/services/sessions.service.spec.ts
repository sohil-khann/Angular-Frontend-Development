import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { SessionsService } from './sessions.service';

describe('SessionsService', () => {
  let service: SessionsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem(
      'fundooAuthSession',
      JSON.stringify({
        token: 'jwt-token'
      })
    );

    TestBed.configureTestingModule({
      providers: [SessionsService, provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()]
    });

    service = TestBed.inject(SessionsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should load active sessions', () => {
    service.getSessions().subscribe();

    const request = httpTestingController.expectOne('https://localhost:7008/api/sessions');
    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('should terminate all other sessions', () => {
    service.terminateAllOtherSessions().subscribe();

    const request = httpTestingController.expectOne(
      'https://localhost:7008/api/sessions/terminate-all'
    );
    expect(request.request.method).toBe('DELETE');
    request.flush({});
  });
});
