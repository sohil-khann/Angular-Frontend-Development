import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { buildFriendlyError } from '../helpers/api-error.helper';
import {
  CreateNoteRequest,
  NoteFilterRequest,
  NoteModel,
  UpdateNoteRequest
} from '../models/note.models';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private readonly apiBaseUrl = `${environment.apiUrl}/notes`;

  constructor(private readonly httpClient: HttpClient) {}

  getNotes(filter: NoteFilterRequest = {}): Observable<NoteModel[]> {
    let params = new HttpParams();

    if (filter.isArchived !== undefined && filter.isArchived !== null) {
      params = params.set('isArchived', filter.isArchived);
    }

    if (filter.isPinned !== undefined && filter.isPinned !== null) {
      params = params.set('isPinned', filter.isPinned);
    }

    if (filter.isTrashed !== undefined && filter.isTrashed !== null) {
      params = params.set('isTrashed', filter.isTrashed);
    }

    if (filter.labelId !== undefined && filter.labelId !== null) {
      params = params.set('labelId', filter.labelId);
    }

    return this.httpClient
      .get<NoteModel[]>(this.apiBaseUrl, { params })
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to load notes right now.')));
  }

  getNoteById(noteId: number): Observable<NoteModel> {
    return this.httpClient
      .get<NoteModel>(`${this.apiBaseUrl}/${noteId}`)
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to load the note right now.')));
  }

  getReminderNotes(fromDate?: string | null, toDate?: string | null): Observable<NoteModel[]> {
    let params = new HttpParams();

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }

    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.httpClient
      .get<NoteModel[]>(`${this.apiBaseUrl}/reminders`, { params })
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to load reminder notes right now.')));
  }

  createNote(noteData: CreateNoteRequest): Observable<NoteModel> {
    return this.httpClient
      .post<NoteModel>(this.apiBaseUrl, noteData)
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to create the note right now.')));
  }

  updateNote(noteId: number, noteData: UpdateNoteRequest): Observable<NoteModel> {
    return this.httpClient
      .put<NoteModel>(`${this.apiBaseUrl}/${noteId}`, noteData)
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to update the note right now.')));
  }

  togglePin(noteId: number, isPinned: boolean): Observable<NoteModel> {
    return this.httpClient
      .patch<NoteModel>(`${this.apiBaseUrl}/${noteId}/pin`, { isPinned })
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to pin the note right now.')));
  }

  toggleArchive(noteId: number, isArchived: boolean): Observable<NoteModel> {
    return this.httpClient
      .patch<NoteModel>(`${this.apiBaseUrl}/${noteId}/archive`, { isArchived })
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to archive the note right now.')));
  }

  toggleTrash(noteId: number, isTrashed: boolean): Observable<NoteModel> {
    return this.httpClient
      .patch<NoteModel>(`${this.apiBaseUrl}/${noteId}/trash`, { isTrashed })
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to move the note right now.')));
  }

  moveToTrash(noteId: number): Observable<string> {
    return this.httpClient.delete(`${this.apiBaseUrl}/${noteId}`, { responseType: 'text' }).pipe(
      catchError((error) => this.throwFriendlyError(error, 'Unable to move the note to trash right now.'))
    );
  }

  restoreNote(noteId: number): Observable<NoteModel> {
    return this.httpClient
      .post<NoteModel>(`${this.apiBaseUrl}/${noteId}/restore`, {})
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to restore the note right now.')));
  }

  deleteNotePermanently(noteId: number): Observable<string> {
    return this.httpClient
      .delete(`${this.apiBaseUrl}/${noteId}/permanent`, { responseType: 'text' })
      .pipe(
        catchError((error) =>
          this.throwFriendlyError(error, 'Unable to permanently delete the note right now.')
        )
      );
  }

  emptyTrash(): Observable<string> {
    return this.httpClient.delete(`${this.apiBaseUrl}/trash/empty`, { responseType: 'text' }).pipe(
      catchError((error) => this.throwFriendlyError(error, 'Unable to empty the trash right now.'))
    );
  }

  private throwFriendlyError(error: unknown, fallbackMessage: string): Observable<never> {
    return throwError(() => buildFriendlyError(error, fallbackMessage));
  }
}
