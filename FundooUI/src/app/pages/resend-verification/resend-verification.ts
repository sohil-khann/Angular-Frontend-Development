import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resend-verification',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './resend-verification.html',
  styleUrl: './resend-verification.scss'
})
export class ResendVerification {
  isFormSubmitted = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  resendForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });

  constructor(private readonly authService: AuthService) {
    const savedEmail = this.authService.getLoggedInUser()?.email ?? '';
    if (savedEmail) {
      this.resendForm.controls.email.setValue(savedEmail);
    }
  }

  onSubmit(): void {
    this.isFormSubmitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.resendForm.markAllAsTouched();

    if (this.resendForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const email = this.resendForm.controls.email.value;

    this.authService.resendVerification(email).subscribe({
      next: (message) => {
        this.successMessage = message;
        this.isSubmitting = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isSubmitting = false;
      }
    });
  }

  hasControlError(): boolean {
    const control = this.resendForm.controls.email;
    return control.invalid && (control.touched || this.isFormSubmitted);
  }
}
