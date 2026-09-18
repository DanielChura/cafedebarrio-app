import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, AuthUser, LoginRequest, RegisterRequest, UserResponse, UserRole } from '../models';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
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
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): UserRole | null {
    const savedUser = localStorage.getItem('user');
    if (savedUser === null) {
      return null;
    }
    try {
      return (JSON.parse(savedUser) as AuthUser).role;
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
  }
}
