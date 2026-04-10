import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-keep-header',
  imports: [FormsModule, RouterLink],
  templateUrl: './keep-header.html',
  styleUrl: './keep-header.scss'
})
export class KeepHeader {
  @Input() searchText = '';
  @Input() currentUserName = 'User';
  @Input() currentUserEmail = '';
  @Input() isEmailVerified = false;
  @Input() isWorking = false;

  @Output() searchTextChange = new EventEmitter<string>();
  @Output() menuToggleRequested = new EventEmitter<void>();
  @Output() refreshSessionRequested = new EventEmitter<void>();
  @Output() resendVerificationRequested = new EventEmitter<void>();
  @Output() logoutRequested = new EventEmitter<void>();
  @Output() logoutAllRequested = new EventEmitter<void>();

  isProfileMenuOpen = false;

  onSearchChange(searchText: string): void {
    this.searchTextChange.emit(searchText);
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }
}
