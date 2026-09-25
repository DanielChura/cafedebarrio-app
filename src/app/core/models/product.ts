import { PageParams } from './page';

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: File;
  categoryId: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  active: boolean;
  categoryId: string;
  categoryName: string;
  averageRating?: number;
  reviewCount?: number;
}

export interface ProductFilters extends PageParams {
  categoryId?: string;
  name?: string;
  onlyActive?: boolean;
}
