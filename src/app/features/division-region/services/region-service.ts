import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { RegionModel } from '@features/division-region/models/region-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegionService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'division-region';

  getAll(): Observable<ApiResponseModel<RegionModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<RegionModel[]>>(
      `${this.endpoint}`
    );
  }
}
