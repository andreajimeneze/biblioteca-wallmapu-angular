import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { AdminStatsModel, StatModel } from '@features/stats/models/stat-model';

@Injectable({
  providedIn: 'root',
})
export class StatService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'stat';

  getAll(): Observable<ApiResponseModel<StatModel>> {
    return this.apiResponseService.getAll<ApiResponseModel<StatModel>>(
      `${this.endpoint}/admin`
    );
  }

  getAdminStats(): Observable<ApiResponseModel<AdminStatsModel>> {
    return this.apiResponseService.getAll<ApiResponseModel<AdminStatsModel>>(
      `${this.endpoint}/admin-stats`
    );
  }
}
