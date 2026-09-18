import { Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartIcon } from '../../../shared/icons/cart-icon';
import { CategoryIcon } from '../../../shared/icons/category-icon';
import { ProductIcon } from '../../../shared/icons/product-icon';
import { UserIcon } from '../../../shared/icons/user-icon';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgComponentOutlet],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly links = [
    { path: 'categorias', label: 'Categorías', icon: CategoryIcon },
    { path: 'productos', label: 'Productos', icon: ProductIcon },
    { path: 'usuarios', label: 'Usuarios', icon: UserIcon },
    { path: 'ordenes', label: 'Órdenes', icon: CartIcon },
  ];
}
