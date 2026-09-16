import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  OrderRequest,
  OrderResponse,
  OrderStatusRequest,
  Page,
  PageParams,
  toHttpParams,
} from '../models';

@Service()
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  findAll(filters: PageParams = {}): Observable<Page<OrderResponse>> {
    return this.http.get<Page<OrderResponse>>(this.apiUrl, { params: toHttpParams(filters) });
  }

  findById(id: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`);
  }

  create(request: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, request);
  }

  updateStatus(id: string, request: OrderStatusRequest): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.apiUrl}/${id}/status`, request);
  }
}
