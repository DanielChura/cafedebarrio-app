export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse extends AuthUser {
  token: string;
}

export interface UserResponse extends AuthUser {
  createdAt: string;
}
