import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CollaboratorModel, InviteCollaboratorRequest } from '../../models/collaborator.models';
import { LabelModel } from '../../models/label.models';
import { NoteModel, UpdateNoteRequest } from '../../models/note.models';

@Component({
  selector: 'app-note-editor-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './note-editor-dialog.html',
  styleUrl: './note-editor-dialog.scss'
})
export class NoteEditorDialog implements OnChanges {
  @Input({ required: true }) note!: NoteModel;
  @Input() availableLabels: LabelModel[] = [];
  @Input() collaborators: CollaboratorModel[] = [];
  @Input() isSaving = false;
  @Input() errorMessage = '';

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<UpdateNoteRequest>();
  @Output() collaboratorInvited = new EventEmitter<InviteCollaboratorRequest>();
  @Output() collaboratorRemoved = new EventEmitter<CollaboratorModel>();

  selectedLabelIds: number[] = [];

  readonly colorOptions = ['#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8'];

  noteForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    description: new FormControl('', { nonNullable: true }),
    reminder: new FormControl('', { nonNullable: true }),
    color: new FormControl('#ffffff', { nonNullable: true }),
    isPinned: new FormControl(false, { nonNullable: true }),
    isArchived: new FormControl(false, { nonNullable: true })
  });

  inviteForm = new FormGroup({
    collaboratorEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    message: new FormControl('', { nonNullable: true })
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['note']?.currentValue) {
      this.syncFormWithNote();
    }
  }

  isLabelSelected(labelId: number): boolean {
    return this.selectedLabelIds.includes(labelId);
  }

  toggleLabel(labelId: number): void {
    if (this.selectedLabelIds.includes(labelId)) {
      this.selectedLabelIds = this.selectedLabelIds.filter((currentId) => currentId !== labelId);
      return;
    }

    this.selectedLabelIds = [...this.selectedLabelIds, labelId];
  }

  submitNote(): void {
    this.noteForm.markAllAsTouched();

    if (this.noteForm.invalid) {
      return;
    }

    const formValue = this.noteForm.getRawValue();
    this.saved.emit({
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      reminder: formValue.reminder ? new Date(formValue.reminder).toISOString() : null,
      color: formValue.color,
      isPinned: formValue.isPinned,
      isArchived: formValue.isArchived,
      labelIds: this.selectedLabelIds
    });
  }

  submitInvitation(): void {
    this.inviteForm.markAllAsTouched();

    if (this.inviteForm.invalid) {
      return;
    }

    const formValue = this.inviteForm.getRawValue();

    this.collaboratorInvited.emit({
      collaboratorEmail: formValue.collaboratorEmail.trim().toLowerCase(),
      message: formValue.message.trim() || null
    });

    this.inviteForm.reset({
      collaboratorEmail: '',
      message: ''
    });
  }

  private syncFormWithNote(): void {
    this.noteForm.reset({
      title: this.note.title,
      description: this.note.description,
      reminder: this.note.reminder ? this.formatReminderValue(this.note.reminder) : '',
      color: this.note.color,
      isPinned: this.note.isPinned,
      isArchived: this.note.isArchived
    });

    this.selectedLabelIds = this.note.labels.map((label) => label.id);
  }

  private formatReminderValue(reminder: string): string {
    const date = new Date(reminder);
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
  }
}
