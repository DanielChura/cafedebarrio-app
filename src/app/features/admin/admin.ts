import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './admin.html',
})
export class Admin {}
