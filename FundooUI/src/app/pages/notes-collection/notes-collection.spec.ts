import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';
import { CollaboratorsService } from '../../services/collaborators.service';
import { KeepStateService } from '../../services/keep-state.service';
import { LabelsService } from '../../services/labels.service';
import { LabelsStoreService } from '../../services/labels-store.service';
import { NotesService } from '../../services/notes.service';
import { NotesCollection } from './notes-collection';

describe('NotesCollection', () => {
  let component: NotesCollection;
  let fixture: ComponentFixture<NotesCollection>;
  let routeData$: BehaviorSubject<Record<string, unknown>>;
  let routeParams$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let notesService: {
    getNotes: ReturnType<typeof vi.fn>;
    getReminderNotes: ReturnType<typeof vi.fn>;
    getNoteById: ReturnType<typeof vi.fn>;
    createNote: ReturnType<typeof vi.fn>;
    updateNote: ReturnType<typeof vi.fn>;
    togglePin: ReturnType<typeof vi.fn>;
    toggleArchive: ReturnType<typeof vi.fn>;
    moveToTrash: ReturnType<typeof vi.fn>;
    restoreNote: ReturnType<typeof vi.fn>;
    deleteNotePermanently: ReturnType<typeof vi.fn>;
    emptyTrash: ReturnType<typeof vi.fn>;
  };
  let labelsService: {
    getNotesByLabel: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    routeData$ = new BehaviorSubject<Record<string, unknown>>({ view: 'notes' });
    routeParams$ = new BehaviorSubject(convertToParamMap({}));

    notesService = {
      getNotes: vi.fn(() => of([])),
      getReminderNotes: vi.fn(() => of([])),
      getNoteById: vi.fn(() => of({})),
      createNote: vi.fn(() => of({ id: 1 })),
      updateNote: vi.fn(() => of({})),
      togglePin: vi.fn(() => of({})),
      toggleArchive: vi.fn(() => of({})),
      moveToTrash: vi.fn(() => of('ok')),
      restoreNote: vi.fn(() => of({})),
      deleteNotePermanently: vi.fn(() => of('ok')),
      emptyTrash: vi.fn(() => of('ok'))
    };

    labelsService = {
      getNotesByLabel: vi.fn(() => of([]))
    };

    await TestBed.configureTestingModule({
      imports: [NotesCollection],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: routeData$.asObservable(),
            paramMap: routeParams$.asObservable()
          }
        },
        {
          provide: KeepStateService,
          useValue: {
            searchText$: of(''),
            setSearchText: vi.fn()
          }
        },
        {
          provide: LabelsStoreService,
          useValue: {
            labels$: of([]),
            getCurrentLabels: vi.fn(() => []),
            loadLabels: vi.fn(() => of([]))
          }
        },
        {
          provide: LabelsService,
          useValue: labelsService
        },
        {
          provide: NotesService,
          useValue: notesService
        },
        {
          provide: CollaboratorsService,
          useValue: {
            getCollaborators: vi.fn(() => of([])),
            inviteCollaborator: vi.fn(() => of({})),
            removeCollaborator: vi.fn(() => of('ok'))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotesCollection);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should load standard notes for the notes route', () => {
    expect(component.view).toBe('notes');
    expect(notesService.getNotes).toHaveBeenCalledWith({
      isArchived: false,
      isTrashed: false
    });
  });

  it('should load archive notes when the route view changes', () => {
    routeData$.next({ view: 'archive' });
    fixture.detectChanges();

    expect(component.view).toBe('archive');
    expect(notesService.getNotes).toHaveBeenCalledWith({
      isArchived: true,
      isTrashed: false
    });
  });

  it('should load label notes when a label route is active', () => {
    routeData$.next({ view: 'label' });
    routeParams$.next(convertToParamMap({ labelId: '7' }));
    fixture.detectChanges();

    expect(labelsService.getNotesByLabel).toHaveBeenCalledWith(7);
  });
});
