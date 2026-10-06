export interface CartItemRequest {
  productId: string;
  quantity: number;
}

export interface CartItemResponse {
  productId: string;
  productName: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItemResponse[];
  total: number;
}
