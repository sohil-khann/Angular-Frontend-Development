import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { CollaboratorsService } from './collaborators.service';

describe('CollaboratorsService', () => {
  let service: CollaboratorsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem(
      'fundooAuthSession',
      JSON.stringify({
        token: 'jwt-token'
      })
    );

    TestBed.configureTestingModule({
      providers: [
        CollaboratorsService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CollaboratorsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should invite a collaborator', () => {
    service
      .inviteCollaborator(5, {
        collaboratorEmail: 'friend@example.com',
        message: 'Join this note'
      })
      .subscribe();

    const request = httpTestingController.expectOne(
      'https://localhost:7008/api/notes/5/collaborators/invite'
    );
    expect(request.request.method).toBe('POST');
    request.flush({});
  });

  it('should load pending invitations', () => {
    service.getPendingInvitations().subscribe();

    const request = httpTestingController.expectOne(
      'https://localhost:7008/api/notes/collaborators/invitations/pending'
    );
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
