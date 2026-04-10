import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NoteCollectionView, NoteModel } from '../../models/note.models';

@Component({
  selector: 'app-note-card',
  imports: [],
  templateUrl: './note-card.html',
  styleUrl: './note-card.scss'
})
export class NoteCard {
  @Input({ required: true }) note!: NoteModel;
  @Input() view: NoteCollectionView = 'notes';

  @Output() edit = new EventEmitter<NoteModel>();
  @Output() pinToggle = new EventEmitter<NoteModel>();
  @Output() archiveToggle = new EventEmitter<NoteModel>();
  @Output() moveToTrash = new EventEmitter<NoteModel>();
  @Output() restore = new EventEmitter<NoteModel>();
  @Output() deletePermanently = new EventEmitter<NoteModel>();

  get updatedDate(): string {
    return new Date(this.note.updatedAt).toLocaleDateString();
  }

  get reminderDate(): string {
    return this.note.reminder ? new Date(this.note.reminder).toLocaleString() : '';
  }
}
