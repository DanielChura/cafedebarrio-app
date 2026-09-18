export type OrderState = 'PENDING' | 'PREPARING' | 'DELIVERED';

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface OrderRequest {
  userId: string;
  phone: string;
  address: string;
  items: OrderItemRequest[];
}

export interface OrderStatusRequest {
  status: OrderState;
}

export interface OrderItemResponse {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponse {
  id: string;
  userId: string;
  phone: string;
  address: string;
  status: OrderState;
  total: number;
  createdAt: string;
  items: OrderItemResponse[];
}
