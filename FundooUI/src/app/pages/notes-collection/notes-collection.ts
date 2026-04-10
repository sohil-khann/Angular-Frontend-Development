import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NoteEditorDialog } from '../../components/note-editor-dialog/note-editor-dialog';
import { NotesBoard } from '../../components/notes-board/notes-board';
import {
  CollaboratorModel,
  InviteCollaboratorRequest
} from '../../models/collaborator.models';
import { LabelModel } from '../../models/label.models';
import {
  CreateNotePayload,
  NoteCollectionView,
  NoteModel,
  UpdateNoteRequest
} from '../../models/note.models';
import { CollaboratorsService } from '../../services/collaborators.service';
import { KeepStateService } from '../../services/keep-state.service';
import { LabelsService } from '../../services/labels.service';
import { LabelsStoreService } from '../../services/labels-store.service';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-notes-collection',
  imports: [NotesBoard, NoteEditorDialog],
  templateUrl: './notes-collection.html',
  styleUrl: './notes-collection.scss'
})
export class NotesCollection implements OnInit, OnDestroy {
  view: NoteCollectionView = 'notes';
  labelId: number | null = null;
  notes: NoteModel[] = [];
  searchText = '';
  statusMessage = '';
  errorMessage = '';
  isLoadingNotes = false;
  isWorking = false;
  selectedNote: NoteModel | null = null;
  selectedCollaborators: CollaboratorModel[] = [];
  editorErrorMessage = '';
  isEditorOpen = false;
  availableLabels: LabelModel[] = [];

  private readonly subscription = new Subscription();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly keepStateService: KeepStateService,
    private readonly labelsService: LabelsService,
    private readonly labelsStore: LabelsStoreService,
    private readonly notesService: NotesService,
    private readonly collaboratorsService: CollaboratorsService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.keepStateService.searchText$.subscribe((searchText) => {
        this.searchText = searchText;
        this.refreshView();
      })
    );

    this.subscription.add(
      this.labelsStore.labels$.subscribe((labels) => {
        this.availableLabels = labels;
        this.refreshView();
      })
    );

    if (!this.labelsStore.getCurrentLabels().length) {
      this.subscription.add(
        this.labelsStore.loadLabels().subscribe({
          next: () => {
            this.refreshView();
          },
          error: (error: Error) => {
            this.errorMessage = error.message;
            this.refreshView();
          }
        })
      );
    }

    this.subscription.add(
      combineLatest([this.activatedRoute.data, this.activatedRoute.paramMap]).subscribe(
        ([routeData, paramMap]) => {
          this.view = (routeData['view'] as NoteCollectionView | undefined) ?? 'notes';
          //this.view = 'notes';
          this.labelId = paramMap.get('labelId') ? Number(paramMap.get('labelId')) : null;
          this.closeEditor();
          this.loadNotes();
          this.refreshView();
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get pageTitle(): string {
    if (this.view === 'archive') {
      return 'Archive';
    }

    if (this.view === 'trash') {
      return 'Trash';
    }

    if (this.view === 'reminders') {
      return 'Reminders';
    }

    if (this.view === 'label') {
      return this.activeLabel?.name ?? 'Label notes';
    }

    return 'Notes';
  }

  get activeLabel(): LabelModel | undefined {
    return this.availableLabels.find((label) => label.id === this.labelId);
  }

  get emptyMessage(): string {
    if (this.view === 'archive') {
      return 'Archived notes appear here';
    }

    if (this.view === 'trash') {
      return 'No notes in trash';
    }

    if (this.view === 'reminders') {
      return 'Notes with reminders appear here';
    }

    if (this.view === 'label') {
      return 'Notes linked to this label appear here';
    }

    return 'Notes you add appear here';
  }

  get showComposer(): boolean {
    return this.view === 'notes' || this.view === 'label';
  }

  get preselectedLabelIds(): number[] {
    return this.view === 'label' && this.labelId ? [this.labelId] : [];
  }

  createNote(payload: CreateNotePayload): void {
    const labelIds = [...payload.note.labelIds];

    if (this.labelId && !labelIds.includes(this.labelId)) {
      labelIds.push(this.labelId);
    }

    this.setWorkingState();

    this.notesService
      .createNote({
        ...payload.note,
        labelIds
      })
      .subscribe({
        next: (createdNote) => {
          if (payload.isPinned) {
            this.notesService.togglePin(createdNote.id, true).subscribe({
              next: () => {
                this.statusMessage = 'Pinned note created successfully.';
                this.isWorking = false;
                this.loadNotes();
                this.refreshView();
              },
              error: (error: Error) => {
                this.errorMessage = error.message;
                this.isWorking = false;
                this.loadNotes();
                this.refreshView();
              }
            });
            return;
          }

          this.statusMessage = 'Note created successfully.';
          this.isWorking = false;
          this.loadNotes();
          this.refreshView();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isWorking = false;
          this.refreshView();
        }
      });
  }

  openEditor(note: NoteModel): void {
    this.setWorkingState();
    this.editorErrorMessage = '';

    this.subscription.add(
      forkJoin({
        note: this.notesService.getNoteById(note.id),
        collaborators: this.collaboratorsService.getCollaborators(note.id).pipe(
          catchError(() => of(note.collaborators))
        )
      }).subscribe({
        next: ({ note: selectedNote, collaborators }) => {
          this.selectedNote = selectedNote;
          this.selectedCollaborators = collaborators;
          this.isEditorOpen = true;
          this.isWorking = false;
          this.refreshView();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isWorking = false;
          this.refreshView();
        }
      })
    );
  }

  closeEditor(): void {
    this.selectedNote = null;
    this.selectedCollaborators = [];
    this.editorErrorMessage = '';
    this.isEditorOpen = false;
    this.refreshView();
  }

  saveNote(updateData: UpdateNoteRequest): void {
    if (!this.selectedNote) {
      return;
    }

    this.isWorking = true;
    this.editorErrorMessage = '';

    this.notesService.updateNote(this.selectedNote.id, updateData).subscribe({
      next: () => {
        this.statusMessage = 'Note updated successfully.';
        this.isWorking = false;
        this.closeEditor();
        this.loadNotes();
        this.refreshView();
      },
      error: (error: Error) => {
        this.editorErrorMessage = error.message;
        this.isWorking = false;
        this.refreshView();
      }
    });
  }

  inviteCollaborator(inviteData: InviteCollaboratorRequest): void {
    if (!this.selectedNote) {
      return;
    }

    this.isWorking = true;
    this.editorErrorMessage = '';

    this.collaboratorsService.inviteCollaborator(this.selectedNote.id, inviteData).subscribe({
      next: () => {
        this.statusMessage = 'Collaborator invitation sent.';
        this.isWorking = false;
        this.reloadEditorData(this.selectedNote!.id);
        this.refreshView();
      },
      error: (error: Error) => {
        this.editorErrorMessage = error.message;
        this.isWorking = false;
        this.refreshView();
      }
    });
  }

  removeCollaborator(collaborator: CollaboratorModel): void {
    if (!this.selectedNote) {
      return;
    }

    this.isWorking = true;
    this.editorErrorMessage = '';

    this.collaboratorsService
      .removeCollaborator(this.selectedNote.id, collaborator.id)
      .subscribe({
        next: () => {
          this.statusMessage = 'Collaborator removed successfully.';
          this.isWorking = false;
          this.reloadEditorData(this.selectedNote!.id);
          this.refreshView();
        },
        error: (error: Error) => {
          this.editorErrorMessage = error.message;
          this.isWorking = false;
          this.refreshView();
        }
      });
  }

  togglePin(note: NoteModel): void {
    this.setWorkingState();

    this.notesService.togglePin(note.id, !note.isPinned).subscribe({
      next: () => {
        this.statusMessage = note.isPinned ? 'Note unpinned.' : 'Note pinned.';
        this.isWorking = false;
        this.loadNotes();
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isWorking = false;
        this.refreshView();
      }
    });
  }

  toggleArchive(note: NoteModel): void {
    this.setWorkingState();

    this.notesService.toggleArchive(note.id, !note.isArchived).subscribe({
      next: () => {
        this.statusMessage = note.isArchived ? 'Note moved back to notes.' : 'Note archived.';
        this.isWorking = false;
        this.loadNotes();
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isWorking = false;
        this.refreshView();
      }
    });
  }

  moveToTrash(note: NoteModel): void {
    this.setWorkingState();

    this.notesService.moveToTrash(note.id).subscribe({
      next: () => {
        this.statusMessage = 'Note moved to trash.';
        this.isWorking = false;
        this.loadNotes();
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isWorking = false;
        this.refreshView();
      }
    });
  }

  restoreNote(note: NoteModel): void {
    this.setWorkingState();

    this.notesService.restoreNote(note.id).subscribe({
      next: () => {
        this.statusMessage = 'Note restored successfully.';
        this.isWorking = false;
        this.loadNotes();
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isWorking = false;
        this.refreshView();
      }
    });
  }

  deleteNotePermanently(note: NoteModel): void {
    this.setWorkingState();

    this.notesService.deleteNotePermanently(note.id).subscribe({
      next: () => {
        this.statusMessage = 'Note deleted permanently.';
        this.isWorking = false;
        this.loadNotes();
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isWorking = false;
        this.refreshView();
      }
    });
  }

  emptyTrash(): void {
    this.setWorkingState();

    this.notesService.emptyTrash().subscribe({
      next: () => {
        this.statusMessage = 'Trash emptied successfully.';
        this.isWorking = false;
        this.loadNotes();
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isWorking = false;
        this.refreshView();
      }
    });
  }

  private loadNotes(): void {
    this.isLoadingNotes = true;
    this.errorMessage = '';

    let notesRequest;

    if (this.view === 'archive') {
      notesRequest = this.notesService.getNotes({
        isArchived: true,
        isTrashed: false
      });
    } else if (this.view === 'trash') {
      notesRequest = this.notesService.getNotes({
        isTrashed: true
      });
    } else if (this.view === 'reminders') {
      notesRequest = this.notesService.getReminderNotes();
    } else if (this.view === 'label' && this.labelId) {
      notesRequest = this.labelsService.getNotesByLabel(this.labelId);
    } else {
      notesRequest = this.notesService.getNotes({
        isArchived: false,
        isTrashed: false
      });
    }

    this.subscription.add(
      notesRequest.subscribe({
        next: (notes) => {
          this.notes = [...notes];
          this.isLoadingNotes = false;
          this.refreshView();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isLoadingNotes = false;
          this.refreshView();
        }
      })
    );
  }

  private reloadEditorData(noteId: number): void {
    this.subscription.add(
      forkJoin({
        note: this.notesService.getNoteById(noteId),
        collaborators: this.collaboratorsService.getCollaborators(noteId)
      }).subscribe({
        next: ({ note, collaborators }) => {
          this.selectedNote = note;
          this.selectedCollaborators = collaborators;
          this.refreshView();
        },
        error: (error: Error) => {
          this.editorErrorMessage = error.message;
          this.refreshView();
        }
      })
    );
  }

  private setWorkingState(): void {
    this.isWorking = true;
    this.statusMessage = '';
    this.errorMessage = '';
    this.refreshView();
  }

  private refreshView(): void {
    queueMicrotask(() => this.changeDetectorRef.detectChanges());
  }
}
