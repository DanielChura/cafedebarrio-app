import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { RegisterRequest } from '../../../core/models';
import { GoogleIcon } from '../../../shared/icons/google-icon';
import { LogoIcon } from '../../../shared/icons/logo-icon';

@Component({
  imports: [RouterLink, ReactiveFormsModule, GoogleIcon, LogoIcon],
  selector: 'app-register',
  templateUrl: './register.html',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly loading = signal(false);

  readonly form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  google(): void {
    this.auth.loginWithGoogle();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.getRawValue();
    const request: RegisterRequest = {
      name: formValue.name.trim(),
      email: formValue.email.trim(),
      password: formValue.password,
    };
    this.loading.set(true);
    this.auth.register(request).subscribe({
      next: (response) => {
        this.auth.saveSession(response);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
