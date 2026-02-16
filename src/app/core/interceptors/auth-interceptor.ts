import { HttpInterceptorFn } from '@angular/common/http';
import { ROUTES } from '@shared/constants/routes';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt_token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  return next(req);
};
