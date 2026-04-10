import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  isFormSubmitted = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });

  constructor(private readonly authService: AuthService) {}

  onSubmit(): void {
    this.isFormSubmitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.forgotPasswordForm.markAllAsTouched();

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const email = this.forgotPasswordForm.controls.email.value;

    this.authService.forgotPassword(email).subscribe({
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
    const control = this.forgotPasswordForm.controls.email;
    return control.invalid && (control.touched || this.isFormSubmitted);
  }
}
