import { CartIcon } from '../../../shared/icons/cart-icon';
import { CategoryIcon } from '../../../shared/icons/category-icon';
import { ReturnIcon } from '../../../shared/icons/return-icon';
import { ProductIcon } from '../../../shared/icons/product-icon';
import { UserIcon } from '../../../shared/icons/user-icon';
import { Type } from '@angular/core';
import { UserRole } from '../../../core/models';

export interface AdminLink {
  path: string;
  label: string;
  icon: Type<any>;
  roles: UserRole[];
}

export const adminLinks: AdminLink[] = [
  { path: '/admin/categorias', label: 'Categorías', icon: CategoryIcon, roles: ['ADMIN'] },
  { path: '/admin/productos', label: 'Productos', icon: ProductIcon, roles: ['ADMIN'] },
  { path: '/admin/usuarios', label: 'Usuarios', icon: UserIcon, roles: ['ADMIN'] },
  { path: '/admin/ordenes', label: 'Órdenes', icon: CartIcon, roles: ['ADMIN', 'OPERATOR'] },
  {
    path: '/admin/devoluciones',
    label: 'Devoluciones',
    icon: ReturnIcon,
    roles: ['ADMIN', 'OPERATOR'],
  },
];
