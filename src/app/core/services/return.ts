import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Page,
  PageParams,
  ReturnCreateRequest,
  ReturnResponse,
  ReturnStatusRequest,
  toHttpParams,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ReturnService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/returns`;

  findAll(filters: PageParams = {}): Observable<Page<ReturnResponse>> {
    return this.http.get<Page<ReturnResponse>>(this.apiUrl, { params: toHttpParams(filters) });
  }

  findMyReturns(filters: PageParams = {}): Observable<Page<ReturnResponse>> {
    return this.http.get<Page<ReturnResponse>>(`${this.apiUrl}/my-returns`, {
      params: toHttpParams(filters),
    });
  }

  updateStatus(id: string, request: ReturnStatusRequest): Observable<ReturnResponse> {
    return this.http.patch<ReturnResponse>(`${this.apiUrl}/${id}/status`, request);
  }

  create(request: ReturnCreateRequest): Observable<ReturnResponse> {
    return this.http.post<ReturnResponse>(this.apiUrl, request);
  }

  findById(id: string): Observable<ReturnResponse> {
    return this.http.get<ReturnResponse>(`${this.apiUrl}/${id}`);
  }
}
