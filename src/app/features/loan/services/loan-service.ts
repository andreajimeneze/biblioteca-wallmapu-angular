import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { LoanFilterModel, LoanDetailModel, LoanModel } from '@features/loan/models/loan-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'loans';

  getAllPagination(params: PaginationRequestModel<LoanFilterModel>): Observable<ApiResponseModel<PaginationResponseModel<LoanDetailModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    if (params.filter) {
      if (params.filter.id_status && params.filter.id_status > 0)
        path = `${path}&id_status=${params.filter.id_status}`
    }

    return this.apiResponseService.getAll<ApiResponseModel<PaginationResponseModel<LoanDetailModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getAllPaginationByUser(params: PaginationRequestModel<LoanFilterModel>): Observable<ApiResponseModel<PaginationResponseModel<LoanDetailModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    if (params.filter) {
      if (params.filter.id_status && params.filter.id_status > 0)
        path = `${path}&id_status=${params.filter.id_status}`
    }

    return this.apiResponseService.getAll<ApiResponseModel<PaginationResponseModel<LoanDetailModel[]>>>(
      `${this.endpoint}/pagination/user${path}`
    );
  }  

  getAllOverdue(): Observable<ApiResponseModel<LoanDetailModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<LoanDetailModel[]>>(
      `${this.endpoint}/overdue`
    );
  }  

  getByCopyBarCode(codebar: string): Observable<ApiResponseModel<LoanDetailModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<LoanDetailModel | null>>(
      `${this.endpoint}/copy`, codebar
    );
  }  

  return(id_copy: number): Observable<ApiResponseModel<LoanModel>> {
    return this.apiResponseService.update<ApiResponseModel<LoanModel>, null>(
      `${this.endpoint}/copy`, `${id_copy}/return`, null
    );
  } 

  expire(): Observable<ApiResponseModel<number>> {
    return this.apiResponseService.update<ApiResponseModel<number>, null>(
      this.endpoint, `expire-overdue`, null
    );
  } 
}