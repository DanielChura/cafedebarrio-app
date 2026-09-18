import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly links = [
    { path: 'categorias', label: 'Categorías' },
    { path: 'productos', label: 'Productos' },
    { path: 'usuarios', label: 'Usuarios' },
    { path: 'ordenes', label: 'Órdenes' },
  ];
}
