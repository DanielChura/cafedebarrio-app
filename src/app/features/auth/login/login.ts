import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { LoginRequest } from '../../../core/models';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly error = signal('');

  readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Ingresa tu correo y contraseña.');
      return;
    }
    const formValue = this.form.getRawValue();
    const request: LoginRequest = { email: formValue.email.trim(), password: formValue.password };
    this.error.set('');
    this.auth.login(request).subscribe({
      next: (response) => {
        this.auth.saveSession(response);
        this.router.navigateByUrl('/');
      },
      error: () => this.error.set('No pudimos iniciar sesión. Revisa tus datos.'),
    });
  }
}
