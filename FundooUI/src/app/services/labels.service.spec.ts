import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { LabelsService } from './labels.service';

describe('LabelsService', () => {
  let service: LabelsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem(
      'fundooAuthSession',
      JSON.stringify({
        token: 'jwt-token'
      })
    );

    TestBed.configureTestingModule({
      providers: [LabelsService, provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()]
    });

    service = TestBed.inject(LabelsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should load labels', () => {
    service.getLabels().subscribe();

    const request = httpTestingController.expectOne('https://localhost:7008/api/labels');
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    request.flush([]);
  });

  it('should request notes for one label', () => {
    service.getNotesByLabel(3).subscribe();

    const request = httpTestingController.expectOne('https://localhost:7008/api/labels/3/notes');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
