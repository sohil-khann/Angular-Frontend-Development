import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CollaboratorModel } from '../../models/collaborator.models';
import { CollaboratorsService } from '../../services/collaborators.service';

@Component({
  selector: 'app-invitations',
  imports: [CommonModule],
  templateUrl: './invitations.html',
  styleUrl: './invitations.scss'
})
export class Invitations implements OnInit {
  invitations: CollaboratorModel[] = [];
  isLoading = false;
  statusMessage = '';
  errorMessage = '';

  constructor(
    private readonly collaboratorsService: CollaboratorsService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInvitations();
  }

  acceptInvitation(invitation: CollaboratorModel): void {
    this.statusMessage = '';
    this.errorMessage = '';

    this.collaboratorsService.acceptInvitation(invitation.id).subscribe({
      next: (message) => {
        this.statusMessage = message;
        this.loadInvitations();
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.refreshView();
      }
    });
  }

  declineInvitation(invitation: CollaboratorModel): void {
    this.statusMessage = '';
    this.errorMessage = '';

    this.collaboratorsService.declineInvitation(invitation.id).subscribe({
      next: (message) => {
        this.statusMessage = message;
        this.loadInvitations();
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.refreshView();
      }
    });
  }

  private loadInvitations(): void {
    this.isLoading = true;

    this.collaboratorsService.getPendingInvitations().subscribe({
      next: (invitations) => {
        this.invitations = invitations;
        this.isLoading = false;
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        this.refreshView();
      }
    });
  }

  private refreshView(): void {
    queueMicrotask(() => this.changeDetectorRef.detectChanges());
  }
}
