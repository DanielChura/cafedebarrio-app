import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page, PageParams, ReturnCreateRequest, ReturnResponse, toHttpParams } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ReturnService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/returns`;

  findMyReturns(filters: PageParams = {}): Observable<Page<ReturnResponse>> {
    return this.http.get<Page<ReturnResponse>>(`${this.apiUrl}/my-returns`, {
      params: toHttpParams(filters),
    });
  }

  create(request: ReturnCreateRequest): Observable<ReturnResponse> {
    return this.http.post<ReturnResponse>(this.apiUrl, request);
  }

  findById(id: string): Observable<ReturnResponse> {
    return this.http.get<ReturnResponse>(`${this.apiUrl}/${id}`);
  }
}
