import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem(
      'fundooAuthSession',
      JSON.stringify({
        token: 'jwt-token'
      })
    );

    TestBed.configureTestingModule({
      providers: [NotesService, provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()]
    });

    service = TestBed.inject(NotesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should request active notes with auth header', () => {
    service
      .getNotes({
        isArchived: false,
        isTrashed: false
      })
      .subscribe();

    const request = httpTestingController.expectOne(
      'https://localhost:7008/api/notes?isArchived=false&isTrashed=false'
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    request.flush([]);
  });

  it('should create a note', () => {
    service
      .createNote({
        title: 'Demo title',
        description: 'Demo description',
        reminder: null,
        color: '#ffffff',
        imageUrl: null,
        labelIds: []
      })
      .subscribe();

    const request = httpTestingController.expectOne('https://localhost:7008/api/notes');
    expect(request.request.method).toBe('POST');
    request.flush({});
  });

  it('should toggle note pin state', () => {
    service.togglePin(5, true).subscribe();

    const request = httpTestingController.expectOne('https://localhost:7008/api/notes/5/pin');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body.isPinned).toBe(true);
    request.flush({});
  });

  it('should request a note by id', () => {
    service.getNoteById(8).subscribe();

    const request = httpTestingController.expectOne('https://localhost:7008/api/notes/8');
    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('should empty the trash', () => {
    service.emptyTrash().subscribe();

    const request = httpTestingController.expectOne('https://localhost:7008/api/notes/trash/empty');
    expect(request.request.method).toBe('DELETE');
    request.flush('done');
  });
});
