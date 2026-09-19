import { CartIcon } from '../../../shared/icons/cart-icon';
import { CategoryIcon } from '../../../shared/icons/category-icon';
import { ProductIcon } from '../../../shared/icons/product-icon';
import { UserIcon } from '../../../shared/icons/user-icon';

export const adminLinks = [
  { path: '/admin/categorias', label: 'Categorías', icon: CategoryIcon },
  { path: '/admin/productos', label: 'Productos', icon: ProductIcon },
  { path: '/admin/usuarios', label: 'Usuarios', icon: UserIcon },
  { path: '/admin/ordenes', label: 'Órdenes', icon: CartIcon },
];
