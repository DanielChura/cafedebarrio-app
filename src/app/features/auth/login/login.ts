import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AUTH_TOKEN_KEY, AuthService } from '../../../core/services/auth';
import { LoginRequest } from '../../../core/models';

@Component({
  imports: [RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly error = signal('');

  submit(email: string, password: string): void {
    const request: LoginRequest = { email: email.trim(), password };
    if (!request.email || !request.password) {
      this.error.set('Ingresa tu correo y contraseña.');
      return;
    }
    this.error.set('');
    this.auth.login(request).subscribe({
      next: (res) => {
        localStorage.setItem(AUTH_TOKEN_KEY, res.token);
        this.router.navigateByUrl('/');
      },
      error: () => this.error.set('No pudimos iniciar sesión. Revisa tus datos.'),
    });
  }
}
