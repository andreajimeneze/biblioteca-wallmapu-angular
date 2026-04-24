import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { LoanFilterModel, LoanModel } from '@features/loan/models/loan-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'loans';

  getAllPagination(params: PaginationRequestModel<LoanFilterModel>): Observable<ApiResponseModel<PaginationResponseModel<any[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    if (params.filter) {
      if (params.filter.id_status && params.filter.id_status > 0)
        path = `${path}&id_status=${params.filter.id_status}`
    }

    return this.apiResponseService.getAll<ApiResponseModel<PaginationResponseModel<LoanFilterModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getAll(): Observable<ApiResponseModel<any>> {
    return this.apiResponseService.getAll<ApiResponseModel<LoanModel[]>>(
      `${this.endpoint}`
    );
  }

  expire(): Observable<ApiResponseModel<number>> {
    return this.apiResponseService.update<ApiResponseModel<number>, null>(
      this.endpoint, `expire-overdue`, null
    );
  } 
}