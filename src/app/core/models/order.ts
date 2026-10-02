export type OrderState = 'PENDING' | 'PREPARING' | 'DELIVERED';

export interface OrderRequest {
  phone: string;
  address: string;
}

export interface OrderStatusRequest {
  status: OrderState;
}

export interface OrderItemResponse {
  // ponytail: id es el orderDetailId del backend; cae a productId si el backend no lo expone
  id?: string;
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
