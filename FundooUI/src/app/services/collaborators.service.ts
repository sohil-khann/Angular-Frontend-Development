import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { buildFriendlyError } from '../helpers/api-error.helper';
import {
  CollaboratorModel,
  InviteCollaboratorRequest
} from '../models/collaborator.models';

interface ApiMessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CollaboratorsService {
  private readonly apiBaseUrl = `${environment.apiUrl}/notes`;

  constructor(private readonly httpClient: HttpClient) {}

  getCollaborators(noteId: number): Observable<CollaboratorModel[]> {
    return this.httpClient
      .get<CollaboratorModel[]>(`${this.apiBaseUrl}/${noteId}/collaborators`)
      .pipe(
        catchError((error) =>
          this.throwFriendlyError(error, 'Unable to load collaborators right now.')
        )
      );
  }

  inviteCollaborator(
    noteId: number,
    collaboratorData: InviteCollaboratorRequest
  ): Observable<CollaboratorModel> {
    return this.httpClient
      .post<CollaboratorModel>(`${this.apiBaseUrl}/${noteId}/collaborators/invite`, collaboratorData)
      .pipe(
        catchError((error) =>
          this.throwFriendlyError(error, 'Unable to invite the collaborator right now.')
        )
      );
  }

  removeCollaborator(noteId: number, collaboratorId: number): Observable<string> {
    return this.httpClient
      .delete(`${this.apiBaseUrl}/${noteId}/collaborators/${collaboratorId}`, {
        responseType: 'text'
      })
      .pipe(
        catchError((error) =>
          this.throwFriendlyError(error, 'Unable to remove the collaborator right now.')
        )
      );
  }

  getPendingInvitations(): Observable<CollaboratorModel[]> {
    return this.httpClient
      .get<CollaboratorModel[]>(`${environment.apiUrl}/notes/collaborators/invitations/pending`)
      .pipe(
        catchError((error) =>
          this.throwFriendlyError(error, 'Unable to load pending invitations right now.')
        )
      );
  }

  acceptInvitation(invitationId: number): Observable<string> {
    return this.httpClient
      .post<ApiMessageResponse>(
        `${environment.apiUrl}/notes/collaborators/invitations/${invitationId}/accept`,
        {}
      )
      .pipe(
        map((response) => response.message),
        catchError((error) =>
          this.throwFriendlyError(error, 'Unable to accept the invitation right now.')
        )
      );
  }

  declineInvitation(invitationId: number): Observable<string> {
    return this.httpClient
      .post<ApiMessageResponse>(
        `${environment.apiUrl}/notes/collaborators/invitations/${invitationId}/decline`,
        {}
      )
      .pipe(
        map((response) => response.message),
        catchError((error) =>
          this.throwFriendlyError(error, 'Unable to decline the invitation right now.')
        )
      );
  }

  private throwFriendlyError(error: unknown, fallbackMessage: string): Observable<never> {
    return throwError(() => buildFriendlyError(error, fallbackMessage));
  }
}
