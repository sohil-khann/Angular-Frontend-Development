import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss'
})
export class VerifyEmail implements OnInit {
  isFormSubmitted = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  verifyForm = new FormGroup({
    token: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const tokenFromQuery = this.activatedRoute.snapshot.queryParamMap.get('token') ?? '';

    if (!tokenFromQuery) {
      this.errorMessage = 'Verification token is missing. Open the latest verification email or request a new verification link.';
      return;
    }

    this.verifyForm.controls.token.setValue(tokenFromQuery);
    this.verifyToken();
  }

  onSubmit(): void {
    this.isFormSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.verifyForm.markAllAsTouched();

    if (this.verifyForm.invalid) {
      return;
    }

    this.verifyToken();
  }

  hasControlError(): boolean {
    const control = this.verifyForm.controls.token;
    return control.invalid && (control.touched || this.isFormSubmitted);
  }

  private verifyToken(): void {
    this.isSubmitting = true;
    const token = this.verifyForm.controls.token.value.trim();

    this.authService.verifyEmail(token).subscribe({
      next: (message) => {
        this.successMessage = message;
        this.errorMessage = '';
        this.isSubmitting = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.successMessage = '';
        this.isSubmitting = false;
      }
    });
  }
}
