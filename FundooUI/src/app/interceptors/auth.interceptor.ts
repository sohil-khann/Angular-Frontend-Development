import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthSession } from '../models/auth.models';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const savedSession = localStorage.getItem('fundooAuthSession');
  const accessToken = savedSession ? (JSON.parse(savedSession) as AuthSession).token : '';

  if (!accessToken || !request.url.startsWith(environment.apiUrl)) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  );
};
