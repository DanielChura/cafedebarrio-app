import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page, ReviewFilters, ReviewRequest, ReviewResponse, toHttpParams } from '../models';

@Service()
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/reviews`;

  findByProduct(filters: ReviewFilters): Observable<Page<ReviewResponse>> {
    return this.http.get<Page<ReviewResponse>>(this.apiUrl, { params: toHttpParams(filters) });
  }

  create(request: ReviewRequest): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(this.apiUrl, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
