import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const isApiRequest = request.url.startsWith(environment.apiUrl);

  if (token === null || !isApiRequest) {
    return next(request);
  }

  const requestWithToken = request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(requestWithToken);
};
