import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  UserResponse,
  UserRole,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  readonly user = signal<AuthUser | null>(this.getUser());

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  loginWithGoogle(): void {
    window.location.href = `${environment.baseUrl}/oauth2/authorization/google`;
  }

  me(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/me`);
  }

  saveSession(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    const user: AuthUser = {
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
    };
    localStorage.setItem('user', JSON.stringify(user));
    this.user.set(user);
  }

  saveSessionFromToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      const response: AuthResponse = {
        token,
        id: payload.id,
        name: payload.name,
        email: payload.sub,
        role: payload.role,
      };
      if (!response.id || !response.email || !response.role) return false;
      this.saveSession(response);
      return true;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): UserRole | null {
    const saved = this.user()?.role ?? null;
    if (saved) return saved;
    try {
      const token = this.getToken();
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return (payload.role as UserRole) ?? null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getUser(): AuthUser | null {
    const savedUser = localStorage.getItem('user');
    if (savedUser === null) {
      return null;
    }
    try {
      return JSON.parse(savedUser) as AuthUser;
    } catch {
      return null;
    }
  }

  getUserId(): string | null {
    return this.getUser()?.id ?? null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);
  }
}
