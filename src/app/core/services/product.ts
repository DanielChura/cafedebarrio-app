import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page, ProductRequest, ProductResponse, ProductFilters, toHttpParams } from '../models';

function toFormData(request: ProductRequest): FormData {
  const form = new FormData();
  form.append('name', request.name);
  if (request.description) form.append('description', request.description);
  form.append('price', String(request.price));
  form.append('stock', String(request.stock));
  if (request.image) form.append('image', request.image);
  form.append('categoryId', request.categoryId);
  return form;
}

@Service()
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  findAll(filters: ProductFilters = {}): Observable<Page<ProductResponse>> {
    return this.http.get<Page<ProductResponse>>(this.apiUrl, { params: toHttpParams(filters) });
  }

  findById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  create(request: ProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, toFormData(request));
  }

  update(id: string, request: ProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, toFormData(request));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
