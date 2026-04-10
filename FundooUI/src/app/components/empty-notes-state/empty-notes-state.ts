import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-notes-state',
  imports: [],
  templateUrl: './empty-notes-state.html',
  styleUrl: './empty-notes-state.scss'
})
export class EmptyNotesState {
  @Input() message = 'Notes you add appear here';
}
