import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt_token');

  // ✅ JWT solo a rutas protegidas
  const protectedRoutes = ['/user', '/admin'];
  const isProtected = protectedRoutes.some(route => req.url.includes(route));

  if (token && isProtected) {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
