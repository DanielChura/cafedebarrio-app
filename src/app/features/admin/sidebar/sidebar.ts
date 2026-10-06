import { Component, computed, inject } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ExitIcon } from '../../../shared/icons/exit-icon';
import { adminLinks } from './admin-links';
import { LogoIcon } from '../../../shared/icons/logo-icon';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgComponentOutlet, ExitIcon, LogoIcon],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private readonly auth = inject(AuthService);

  readonly links = computed(() => {
    const role = this.auth.getRole();
    return adminLinks.filter((link) => (role ? link.roles.includes(role) : false));
  });
}
