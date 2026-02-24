import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { Observable } from 'rxjs';
import { CommuneModel } from '@features/commune/models/commune-model';
import { ApiResponseService } from '@core/services/api-response-service';

@Injectable({
  providedIn: 'root',
})
export class CommuneService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'commune';

  getAll(): Observable<ApiResponseModel<CommuneModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<CommuneModel[]>>(
      `${this.endpoint}`
    );
  }
}
