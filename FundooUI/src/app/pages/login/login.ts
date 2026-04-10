import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  isPasswordVisible = false;
  isFormSubmitted = false;
  errorMessage = '';
  isSubmitting = false;

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onShowPasswordChange(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    this.isFormSubmitted = true;
    this.errorMessage = '';
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    const formValue = this.loginForm.getRawValue();
    this.isSubmitting = true;

    this.authService
      .loginUser({
        email: formValue.email.trim().toLowerCase(),
        password: formValue.password
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          void this.router.navigateByUrl('/home/notes');
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isSubmitting = false;
          this.loginForm.reset();
        }
      });
  }

  hasControlError(controlName: keyof typeof this.loginForm.controls): boolean {
    const control = this.loginForm.controls[controlName];
    return control.invalid && (control.touched || this.isFormSubmitted);
  }
}
