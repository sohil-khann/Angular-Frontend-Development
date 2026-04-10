import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { buildFriendlyError } from '../helpers/api-error.helper';
import { UserSessionsModel } from '../models/session.models';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  private readonly apiBaseUrl = `${environment.apiUrl}/sessions`;

  constructor(private readonly httpClient: HttpClient) {}

  getSessions(): Observable<UserSessionsModel> {
    return this.httpClient
      .get<UserSessionsModel>(this.apiBaseUrl)
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to load sessions right now.')));
  }

  terminateSession(sessionId: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiBaseUrl}/${sessionId}`)
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to terminate the session right now.')));
  }

  terminateAllOtherSessions(): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiBaseUrl}/terminate-all`)
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to terminate the other sessions right now.')));
  }

  private throwFriendlyError(error: unknown, fallbackMessage: string): Observable<never> {
    return throwError(() => buildFriendlyError(error, fallbackMessage));
  }
}
