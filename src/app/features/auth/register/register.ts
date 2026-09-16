import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AUTH_TOKEN_KEY, AuthService } from '../../../core/services/auth';
import { RegisterRequest } from '../../../core/models';

@Component({
  imports: [RouterLink],
  selector: 'app-register',
  templateUrl: './register.html',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly error = signal('');

  submit(name: string, email: string, password: string): void {
    const request: RegisterRequest = { name: name.trim(), email: email.trim(), password };
    if (!request.name || !request.email || !request.password) {
      this.error.set('Completa nombre, correo y contraseña.');
      return;
    }
    this.error.set('');
    this.auth.register(request).subscribe({
      next: (res) => {
        localStorage.setItem(AUTH_TOKEN_KEY, res.token);
        this.router.navigateByUrl('/');
      },
      error: () => this.error.set('No pudimos crear tu cuenta. Intenta de nuevo.'),
    });
  }
}
