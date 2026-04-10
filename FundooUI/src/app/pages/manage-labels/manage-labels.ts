import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelModel } from '../../models/label.models';
import { LabelsService } from '../../services/labels.service';
import { LabelsStoreService } from '../../services/labels-store.service';

@Component({
  selector: 'app-manage-labels',
  imports: [ReactiveFormsModule],
  templateUrl: './manage-labels.html',
  styleUrl: './manage-labels.scss'
})
export class ManageLabels implements OnInit {
  labels: LabelModel[] = [];
  editingLabelId: number | null = null;
  isSubmitting = false;
  statusMessage = '';
  errorMessage = '';

  labelForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    color: new FormControl('#f1f3f4', {
      nonNullable: true
    })
  });

  constructor(
    private readonly labelsService: LabelsService,
    private readonly labelsStore: LabelsStoreService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLabels();
  }

  onSubmit(): void {
    this.statusMessage = '';
    this.errorMessage = '';
    this.labelForm.markAllAsTouched();

    if (this.labelForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.labelForm.getRawValue();
    const labelRequest = {
      name: formValue.name.trim(),
      color: formValue.color
    };

    const request = this.editingLabelId
      ? this.labelsService.updateLabel(this.editingLabelId, labelRequest)
      : this.labelsService.createLabel(labelRequest);

    request.subscribe({
      next: () => {
        this.statusMessage = this.editingLabelId
          ? 'Label updated successfully.'
          : 'Label created successfully.';
        this.isSubmitting = false;
        this.resetForm();
        this.loadLabels();
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isSubmitting = false;
        this.refreshView();
      }
    });
  }

  startEdit(label: LabelModel): void {
    this.editingLabelId = label.id;
    this.labelForm.reset({
      name: label.name,
      color: label.color ?? '#f1f3f4'
    });
    this.refreshView();
  }

  deleteLabel(label: LabelModel): void {
    this.statusMessage = '';
    this.errorMessage = '';

    this.labelsService.deleteLabel(label.id).subscribe({
      next: () => {
        this.statusMessage = 'Label deleted successfully.';
        this.resetForm();
        this.loadLabels();
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.refreshView();
      }
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private loadLabels(): void {
    this.labelsStore.loadLabels().subscribe({
      next: (labels) => {
        this.labels = labels;
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.refreshView();
      }
    });
  }

  private resetForm(): void {
    this.editingLabelId = null;
    this.isSubmitting = false;
    this.labelForm.reset({
      name: '',
      color: '#f1f3f4'
    });
    this.refreshView();
  }

  private refreshView(): void {
    queueMicrotask(() => this.changeDetectorRef.detectChanges());
  }
}
