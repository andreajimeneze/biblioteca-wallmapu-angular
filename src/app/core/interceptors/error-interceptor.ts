import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorModalService } from '@core/services/error-modal-service';
import { AuthStore } from '@features/auth/services/auth-store';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const modalService = inject(ErrorModalService);
  const authStore = inject(AuthStore);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let statusCode = error.status;
      let message = 'Error inesperado';

      if (error.error?.message) {
        message = error.error.message;
      } else if (error.message) {
        message = error.message;
      }

      // ✅ Manejo especial para 401
      if (statusCode === 401) {
        modalService.openError(401, 'Tu sesión ha expirado. Serás redirigido al inicio.');
        
        setTimeout(() => {
          modalService.close();
          authStore.logout();
        }, 3000); // 3 segundos para que el usuario lea el mensaje

        return throwError(() => error);
      }

      modalService.openError(statusCode, message);
      return throwError(() => error);
    })
  );
};
