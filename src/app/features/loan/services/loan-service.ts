import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'loans';

  getAll(): Observable<ApiResponseModel<any>> {
    return this.apiResponseService.getAll<ApiResponseModel<any>>(
      `${this.endpoint}`
    );
  }

}
