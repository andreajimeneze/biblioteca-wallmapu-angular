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

  getDefault(): Observable<ApiResponseModel<LoanPoliciesModel>> {
    return this.apiResponseService.getAll<ApiResponseModel<LoanPoliciesModel>>(
      `${this.endpoint}/default`
    );
  }

  update(id: number, item: LoanPoliciesModel): Observable<ApiResponseModel<LoanPoliciesModel>> {
    return this.apiResponseService.update<ApiResponseModel<LoanPoliciesModel>, LoanPoliciesModel>(
      this.endpoint, id, item
    );
  }
}
