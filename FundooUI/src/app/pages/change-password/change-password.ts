import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../helpers/password-match.validator';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword {
  isFormSubmitted = false;
  isSubmitting = false;
  isPasswordVisible = false;
  successMessage = '';
  errorMessage = '';

  changePasswordForm = new FormGroup(
    {
      currentPassword: new FormControl('', {
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

  constructor(private readonly authService: AuthService) {}

  onShowPasswordChange(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    this.isFormSubmitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.changePasswordForm.markAllAsTouched();

    if (this.changePasswordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.changePasswordForm.getRawValue();

    this.authService
      .changePassword({
        currentPassword: formValue.currentPassword,
        newPassword: formValue.newPassword,
        confirmPassword: formValue.confirmPassword
      })
      .subscribe({
        next: (message) => {
          this.successMessage = message;
          this.isSubmitting = false;
          this.changePasswordForm.reset({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          this.isFormSubmitted = false;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isSubmitting = false;
        }
      });
  }

  hasControlError(controlName: keyof typeof this.changePasswordForm.controls): boolean {
    const control = this.changePasswordForm.controls[controlName];
    return control.invalid && (control.touched || this.isFormSubmitted);
  }
}
