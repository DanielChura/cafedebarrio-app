import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateUserRequest, UserResponse } from '../../../core/models';
import { AuthService } from '../../../core/services/auth';
import { UserService } from '../../../core/services/user';
import { CheckCircleIcon } from '../../../shared/icons/check-circle-icon';
import { UserIcon } from '../../../shared/icons/user-icon';

@Component({
  selector: 'app-me-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    UserIcon,
    CheckCircleIcon,
  ],
  templateUrl: './me-profile.html',
})
export class MeProfile {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly me = signal<UserResponse | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly saveSuccess = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
  });

  constructor() {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.authService.me().subscribe({
      next: (user) => {
        this.me.set(user);
        this.form.patchValue({
          name: user.name ?? '',
          email: user.email ?? '',
          phone: user.phone ?? '',
          address: user.address ?? '',
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo cargar la información de perfil.');
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const id = this.me()?.id;
    if (!id) return;

    const raw = this.form.getRawValue();
    const payload: UpdateUserRequest = {
      name: raw.name.trim(),
      email: raw.email.trim(),
      phone: raw.phone.trim(),
      address: raw.address.trim(),
    };

    this.saving.set(true);
    this.saveSuccess.set(false);
    this.error.set(null);

    this.userService.update(id, payload).subscribe({
      next: (updated) => {
        this.me.set(updated);
        this.saving.set(false);
        this.saveSuccess.set(true);
        this.authService.user.set({
          id: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
        });
      },
      error: () => {
        this.saving.set(false);
        this.error.set('No se pudo guardar la información del perfil.');
      },
    });
  }
}
