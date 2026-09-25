import { PageParams } from './page';

export interface ReviewRequest {
  productId: string;
  rating: number;
  comment?: string;
}

export interface ReviewResponse {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ReviewFilters extends PageParams {
  productId: string;
}
