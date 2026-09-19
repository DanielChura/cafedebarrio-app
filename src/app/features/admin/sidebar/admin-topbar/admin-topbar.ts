import { Component, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { ExitIcon } from '../../../../shared/icons/exit-icon';
import { MenuIcon } from '../../../../shared/icons/menu-icon';
import { adminLinks } from '../admin-links';

@Component({
  selector: 'app-admin-topbar',
  imports: [RouterLink, RouterLinkActive, NgComponentOutlet, ExitIcon, MenuIcon],
  templateUrl: './admin-topbar.html',
})
export class AdminTopbar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly links = adminLinks;
  readonly open = signal(false);

  close(): void {
    this.open.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.close();
    this.router.navigateByUrl('/login');
  }
}
