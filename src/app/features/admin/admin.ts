import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { AdminTopbar } from './sidebar/admin-topbar/admin-topbar';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, Sidebar, AdminTopbar],
  templateUrl: './admin.html',
})
export class Admin {}
