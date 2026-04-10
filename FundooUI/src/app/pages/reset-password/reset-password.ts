import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../helpers/password-match.validator';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  isFormSubmitted = false;
  isSubmitting = false;
  isPasswordVisible = false;
  successMessage = '';
  errorMessage = '';

  resetPasswordForm = new FormGroup(
    {
      token: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)]
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    },
    { validators: passwordMatchValidator }
  );

  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    const tokenFromQuery = this.activatedRoute.snapshot.queryParamMap.get('token') ?? '';
    if (tokenFromQuery) {
      this.resetPasswordForm.controls.token.setValue(tokenFromQuery);
    }
  }

  onShowPasswordChange(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    this.isFormSubmitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.resetPasswordForm.markAllAsTouched();

    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.resetPasswordForm.getRawValue();

    this.authService
      .resetPassword({
        token: formValue.token.trim(),
        newPassword: formValue.newPassword,
        confirmPassword: formValue.confirmPassword
      })
      .subscribe({
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

  hasControlError(controlName: keyof typeof this.resetPasswordForm.controls): boolean {
    const control = this.resetPasswordForm.controls[controlName];
    return control.invalid && (control.touched || this.isFormSubmitted);
  }
}
