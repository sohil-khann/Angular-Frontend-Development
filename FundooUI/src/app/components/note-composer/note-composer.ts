import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LabelModel } from '../../models/label.models';
import { CreateNotePayload } from '../../models/note.models';

@Component({
  selector: 'app-note-composer',
  imports: [ReactiveFormsModule],
  templateUrl: './note-composer.html',
  styleUrl: './note-composer.scss'
})
export class NoteComposer implements OnChanges {
  @Input() availableLabels: LabelModel[] = [];
  @Input() preselectedLabelIds: number[] = [];
  @Output() noteSubmitted = new EventEmitter<CreateNotePayload>();

  isExpanded = false;
  selectedColor = '#ffffff';
  isPinned = false;
  selectedLabelIds: number[] = [];

  readonly colorOptions = ['#ffffff', '#fef3c7', '#dbeafe', '#dcfce7', '#fee2e2', '#ede9fe'];

  noteForm = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true })
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preselectedLabelIds']) {
      this.selectedLabelIds = [...this.preselectedLabelIds];
    }
  }

  expandComposer(): void {
    this.isExpanded = true;
  }

  collapseComposer(): void {
    this.isExpanded = false;
    this.resetComposer();
  }

  togglePin(): void {
    this.isPinned = !this.isPinned;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  toggleLabel(labelId: number): void {
    if (this.selectedLabelIds.includes(labelId)) {
      this.selectedLabelIds = this.selectedLabelIds.filter((currentId) => currentId !== labelId);
      return;
    }

    this.selectedLabelIds = [...this.selectedLabelIds, labelId];
  }

  submitNote(): void {
    const formValue = this.noteForm.getRawValue();
    const cleanedTitle = formValue.title.trim();
    const cleanedDescription = formValue.description.trim();
    const titleToSave = cleanedTitle || cleanedDescription.slice(0, 40);

    if (!titleToSave) {
      return;
    }

    this.noteSubmitted.emit({
      note: {
        title: titleToSave,
        description: cleanedDescription,
        reminder: null,
        color: this.selectedColor,
        imageUrl: null,
        labelIds: this.selectedLabelIds
      },
      isPinned: this.isPinned
    });

    this.resetComposer();
    this.isExpanded = false;
  }

  private resetComposer(): void {
    this.noteForm.reset({
      title: '',
      description: ''
    });
    this.selectedColor = '#ffffff';
    this.isPinned = false;
    this.selectedLabelIds = [...this.preselectedLabelIds];
  }
}
