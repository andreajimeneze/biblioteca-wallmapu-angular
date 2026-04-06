import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { LoanPoliciesModel } from '@features/loan-policies/models/loan-policies-model';

@Injectable({
  providedIn: 'root',
})
export class LoanPoliciesService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'loan-policies';

  getAll(): Observable<ApiResponseModel<LoanPoliciesModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<LoanPoliciesModel[]>>(
      `${this.endpoint}`
    );
  }
}
