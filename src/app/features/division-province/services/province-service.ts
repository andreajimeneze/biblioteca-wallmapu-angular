import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { ProvinceModel } from '@features/division-province/models/province-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'division-province';

  getAll(): Observable<ApiResponseModel<ProvinceModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<ProvinceModel[]>>(
      `${this.endpoint}`
    );
  }
}
