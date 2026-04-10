import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { buildFriendlyError } from '../helpers/api-error.helper';
import { CreateLabelRequest, LabelModel, UpdateLabelRequest } from '../models/label.models';
import { NoteModel } from '../models/note.models';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  private readonly apiBaseUrl = `${environment.apiUrl}/labels`;

  constructor(private readonly httpClient: HttpClient) {}

  getLabels(): Observable<LabelModel[]> {
    return this.httpClient
      .get<LabelModel[]>(this.apiBaseUrl)
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to load labels right now.')));
  }

  createLabel(labelData: CreateLabelRequest): Observable<LabelModel> {
    return this.httpClient
      .post<LabelModel>(this.apiBaseUrl, labelData)
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to create the label right now.')));
  }

  updateLabel(labelId: number, labelData: UpdateLabelRequest): Observable<LabelModel> {
    return this.httpClient
      .put<LabelModel>(`${this.apiBaseUrl}/${labelId}`, labelData)
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to update the label right now.')));
  }

  deleteLabel(labelId: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiBaseUrl}/${labelId}`)
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to delete the label right now.')));
  }

  getNotesByLabel(labelId: number): Observable<NoteModel[]> {
    return this.httpClient
      .get<NoteModel[]>(`${this.apiBaseUrl}/${labelId}/notes`)
      .pipe(catchError((error) => this.throwFriendlyError(error, 'Unable to load label notes right now.')));
  }

  private throwFriendlyError(error: unknown, fallbackMessage: string): Observable<never> {
    return throwError(() => buildFriendlyError(error, fallbackMessage));
  }
}
