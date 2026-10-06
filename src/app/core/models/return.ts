import { OrderItemResponse } from './order';

export type ReturnStatus = 'REQUESTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export const RETURN_REASONS: string[] = [
  'Producto defectuoso o dañado',
  'Producto incorrecto',
  'Producto incompleto',
  'No funciona como se esperaba',
  'Diferente a la descripción',
  'Talla o medida incorrecta',
  'Empaque dañado o manipulado',
];

export interface ReturnStatusRequest {
  status: ReturnStatus;
  operatorNote: string;
}

export interface ReturnDetailRequest {
  orderDetailId: string;
  quantity: number;
}

export interface ReturnCreateRequest {
  orderId: string;
  reason: string;
  comment?: string;
  items: ReturnDetailRequest[];
}

export interface ReturnDetailResponse {
  id: string;
  orderDetailId: string;
  productId: string;
  productName: string | null;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  amount: number;
  orderDetail: OrderItemResponse;
}

export interface ReturnResponse {
  id: string;
  orderId: string;
  userId: string;
  status: ReturnStatus;
  reason: string;
  comment: string | null;
  operatorNote: string | null;
  amount: number;
  createdAt: string;
  items: ReturnDetailResponse[];
}
