import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorModalService } from '@core/services/error-modal-service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const modalService = inject(ErrorModalService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let statusCode = error.status;
      let message = 'Error inesperado';

      if (error.error?.message) {
        message = error.error.message;
      } else if (error.message) {
        message = error.message;
      }

      modalService.openError(statusCode, message);

      return throwError(() => error);
    })
  );
};
