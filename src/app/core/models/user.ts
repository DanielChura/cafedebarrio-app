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
  address?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  address?: string;
  phone?: string;
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
  address?: string;
  phone?: string;
  createdAt: string;
}
