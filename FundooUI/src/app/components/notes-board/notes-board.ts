import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { LabelModel } from '../../models/label.models';
import { CreateNotePayload, NoteCollectionView, NoteModel } from '../../models/note.models';
import { NoteCard } from '../note-card/note-card';
import { NoteComposer } from '../note-composer/note-composer';

@Component({
  selector: 'app-notes-board',
  imports: [NoteComposer, NoteCard],
  templateUrl: './notes-board.html',
  styleUrl: './notes-board.scss'
})
export class NotesBoard {
  constructor(private cdr : ChangeDetectorRef){}
  @Input({ required: true }) title = '';
  @Input() notes: NoteModel[] = [];
  @Input() view: NoteCollectionView = 'notes';
  @Input() searchText = '';
  @Input() availableLabels: LabelModel[] = [];
  @Input() preselectedLabelIds: number[] = [];
  @Input() isLoading = false;
  @Input() statusMessage = '';
  @Input() errorMessage = '';
  @Input() showComposer = false;
  @Input() emptyMessage = 'Nothing to show';
  @Input() showEmptyTrashAction = false;

  
  @Output() noteCreated = new EventEmitter<CreateNotePayload>();
  @Output() editNote = new EventEmitter<NoteModel>();
  @Output() pinToggle = new EventEmitter<NoteModel>();
  @Output() archiveToggle = new EventEmitter<NoteModel>();
  @Output() moveToTrash = new EventEmitter<NoteModel>();
  @Output() restoreNote = new EventEmitter<NoteModel>();
  @Output() deletePermanently = new EventEmitter<NoteModel>();
  @Output() emptyTrashRequested = new EventEmitter<void>();

  get filteredNotes(): NoteModel[] {

    const normalizedSearch = this.searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return this.notes;
    }

    return this.notes.filter((note) => {
      const searchArea =
        `${note.title} ${note.description} ${note.labels.map((label) => label.name).join(' ')}`.toLowerCase();

      return searchArea.includes(normalizedSearch);
    });
  }

  get showPinnedSections(): boolean {
    return this.view === 'notes' || this.view === 'label';
  }

  get pinnedNotes(): NoteModel[] {
    if (!this.showPinnedSections) {
      return [];
    }

    return this.filteredNotes.filter((note) => note.isPinned);
  }

  get otherNotes(): NoteModel[] {
    if (!this.showPinnedSections) {
      return this.filteredNotes;
    }

    return this.filteredNotes.filter((note) => !note.isPinned);
  }
}
