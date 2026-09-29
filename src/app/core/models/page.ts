import { HttpParams } from '@angular/common/http';

export interface Page<T> {
  content: T[];
  size: number;
  number?: number;
  totalElements?: number;
  totalPages?: number;
}

export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}

export function toHttpParams(filters: object): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  }
  return params;
}
