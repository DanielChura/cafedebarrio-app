import { Component, computed, inject } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { ExitIcon } from '../../shared/icons/exit-icon';
import { ProductIcon } from '../../shared/icons/product-icon';
import { ReturnIcon } from '../../shared/icons/return-icon';
import { UserIcon } from '../../shared/icons/user-icon';

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgComponentOutlet],
  templateUrl: './me.html',
})
export class Me {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.user;

  readonly links = [
    { path: '/me/profile', label: 'Mi perfil', icon: UserIcon },
    { path: '/me/orders', label: 'Mis órdenes', icon: ProductIcon },
    { path: '/me/returns', label: 'Mis devoluciones', icon: ReturnIcon },
  ];
  readonly exitIcon = ExitIcon;

  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días,';
    if (hour < 19) return 'Buenas tardes,';
    return 'Buenas noches,';
  });

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
