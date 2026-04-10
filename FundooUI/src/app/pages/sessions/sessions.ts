import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SessionInfoModel, UserSessionsModel } from '../../models/session.models';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'app-sessions',
  imports: [CommonModule],
  templateUrl: './sessions.html',
  styleUrl: './sessions.scss'
})
export class Sessions implements OnInit {
  sessionsData: UserSessionsModel | null = null;
  isLoading = false;
  statusMessage = '';
  errorMessage = '';

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  terminateSession(session: SessionInfoModel): void {
    this.statusMessage = '';
    this.errorMessage = '';

    this.sessionsService.terminateSession(session.sessionId).subscribe({
      next: () => {
        this.statusMessage = 'Session terminated successfully.';
        this.loadSessions();
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.refreshView();
      }
    });
  }

  terminateAllOtherSessions(): void {
    this.statusMessage = '';
    this.errorMessage = '';

    this.sessionsService.terminateAllOtherSessions().subscribe({
      next: () => {
        this.statusMessage = 'All other sessions terminated successfully.';
        this.loadSessions();
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.refreshView();
      }
    });
  }

  private loadSessions(): void {
    this.isLoading = true;

    this.sessionsService.getSessions().subscribe({
      next: (sessionsData) => {
        this.sessionsData = sessionsData;
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
