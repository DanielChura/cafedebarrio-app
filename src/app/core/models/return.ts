export type ReturnStatus = string;

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
  quantity: number;
  amount: number;
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
