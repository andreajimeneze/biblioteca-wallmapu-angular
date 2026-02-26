import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { StatModel } from '@features/stats/models/stat-model';

@Injectable({
  providedIn: 'root',
})
export class StatService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'stat/admin';

  getAll(): Observable<ApiResponseModel<StatModel>> {
    return this.apiResponseService.getAll<ApiResponseModel<StatModel>>(
      `${this.endpoint}`
    );
  }
}
