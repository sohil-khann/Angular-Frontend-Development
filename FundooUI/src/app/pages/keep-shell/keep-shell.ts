import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { KeepHeader } from '../../components/keep-header/keep-header';
import { KeepSidebar } from '../../components/keep-sidebar/keep-sidebar';
import { AuthService } from '../../services/auth.service';
import { KeepStateService } from '../../services/keep-state.service';
import { LabelsStoreService } from '../../services/labels-store.service';

@Component({
  selector: 'app-keep-shell',
  imports: [AsyncPipe, RouterOutlet, KeepHeader, KeepSidebar],
  templateUrl: './keep-shell.html',
  styleUrl: './keep-shell.scss'
})
export class KeepShell implements OnInit {
  searchText = '';
  statusMessage = '';
  errorMessage = '';
  isWorking = false;
  sidebarOpen = true;

  constructor(
    private readonly authService: AuthService,
    private readonly keepStateService: KeepStateService,
    private readonly labelsStore: LabelsStoreService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  get labels$() {
    return this.labelsStore.labels$;
  }

  ngOnInit(): void {
    this.keepStateService.searchText$.subscribe((searchText) => {
      this.searchText = searchText;
      this.refreshView();
    });

    this.labelsStore.loadLabels().subscribe({
      next: () => {
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.refreshView();
      }
    });
  }

  get displayName(): string {
    const loggedInUser = this.authService.getLoggedInUser();

    if (!loggedInUser) {
      return 'Fundoo User';
    }

    return `${loggedInUser.firstName} ${loggedInUser.lastName}`.trim();
  }

  get emailAddress(): string {
    return this.authService.getLoggedInUser()?.email ?? '';
  }

  get isEmailVerified(): boolean {
    return this.authService.getLoggedInUser()?.isEmailVerified ?? false;
  }

  onSearchTextChange(searchText: string): void {
    this.keepStateService.setSearchText(searchText);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.refreshView();
  }

  refreshSession(): void {
    this.setWorkingState();

    this.authService.refreshSession().subscribe({
      next: () => {
        this.statusMessage = 'Session refreshed successfully.';
        this.isWorking = false;
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isWorking = false;
        this.refreshView();
      }
    });
  }

  resendVerification(): void {
    this.setWorkingState();

    this.authService.resendVerification(this.emailAddress).subscribe({
      next: (message) => {
        this.statusMessage = message;
        this.isWorking = false;
        this.refreshView();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isWorking = false;
        this.refreshView();
      }
    });
  }

  logout(logoutAllDevices = false): void {
    this.setWorkingState();

    this.authService.logoutUser(logoutAllDevices).subscribe({
      next: () => {
        this.isWorking = false;
        void this.router.navigateByUrl('/login');
      },
      error: () => {
        this.isWorking = false;
        void this.router.navigateByUrl('/login');
      }
    });
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
