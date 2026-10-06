import { PageParams } from './page';

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: File;
  categoryId: string;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: File | null;
  categoryId: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  publicId: string | null;
  active: boolean;
  categoryId: string;
  categoryName: string;
  averageRating: number | null;
  reviewCount: number | null;
}

export interface ProductFilters extends PageParams {
  categoryId?: string;
  name?: string;
  onlyActive?: boolean;
}
