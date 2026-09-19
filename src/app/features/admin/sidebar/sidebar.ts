import { Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ExitIcon } from '../../../shared/icons/exit-icon';
import { adminLinks } from './admin-links';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgComponentOutlet, ExitIcon],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly links = adminLinks;
}
