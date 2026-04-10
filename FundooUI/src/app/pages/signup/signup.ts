import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../helpers/password-match.validator';
import { RegisterRequest } from '../../models/auth.models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  isPasswordVisible = false;
  isFormSubmitted = false;
  submitMessage = '';
  isSubmitting = false;

  signupForm = new FormGroup(
    {
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
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
    private readonly router: Router
  ) {}

  onShowPasswordChange(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    this.isFormSubmitted = true;
    this.submitMessage = '';
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      return;
    }

    const formValue = this.signupForm.getRawValue();
    const userData: RegisterRequest = {
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      email: formValue.email.trim().toLowerCase(),
      password: formValue.password,
      confirmPassword: formValue.confirmPassword
    };
    this.isSubmitting = true;

    this.authService.registerUser(userData).subscribe({
      next: () => {
        this.signupForm.reset({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        this.isFormSubmitted = false;
        this.isSubmitting = false;
        void this.router.navigateByUrl('/login');
      },
      error: (error: Error) => {
        this.submitMessage = error.message;
        this.isSubmitting = false;
        this.signupForm.reset();
      }
    });
  }

  hasControlError(controlName: keyof typeof this.signupForm.controls): boolean {
    const control = this.signupForm.controls[controlName];
    return control.invalid && (control.touched || this.isFormSubmitted);
  }
}
