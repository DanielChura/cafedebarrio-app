import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { RegisterRequest } from '../../../core/models';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-register',
  templateUrl: './register.html',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly error = signal('');

  readonly form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Completa nombre, correo y contraseña.');
      return;
    }
    const formValue = this.form.getRawValue();
    const request: RegisterRequest = {
      name: formValue.name.trim(),
      email: formValue.email.trim(),
      password: formValue.password,
    };
    this.error.set('');
    this.auth.register(request).subscribe({
      next: (response) => {
        this.auth.saveSession(response);
        this.router.navigateByUrl('/');
      },
      error: () => this.error.set('No pudimos crear tu cuenta. Intenta de nuevo.'),
    });
  }
}
