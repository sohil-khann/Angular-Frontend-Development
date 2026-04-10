import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LabelModel } from '../models/label.models';
import { LabelsService } from './labels.service';

@Injectable({
  providedIn: 'root'
})
export class LabelsStoreService {
  private readonly labelsSubject = new BehaviorSubject<LabelModel[]>([]);

  readonly labels$ = this.labelsSubject.asObservable();

  constructor(private readonly labelsService: LabelsService) {}

  loadLabels(): Observable<LabelModel[]> {
    return this.labelsService.getLabels().pipe(
      tap((labels) => {
        this.labelsSubject.next(labels);
      })
    );
  }

  getCurrentLabels(): LabelModel[] {
    return this.labelsSubject.value;
  }
}
