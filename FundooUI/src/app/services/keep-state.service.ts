import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeepStateService {
  private readonly searchTextSubject = new BehaviorSubject('');

  readonly searchText$ = this.searchTextSubject.asObservable();

  setSearchText(searchText: string): void {
    this.searchTextSubject.next(searchText);
  }

  clearSearch(): void {
    this.searchTextSubject.next('');
  }
}
