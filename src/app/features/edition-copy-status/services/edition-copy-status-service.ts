import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { EditionCopyStatusModel } from '@features/edition-copy-status/models/edition-copy-status-model';

@Injectable({
  providedIn: 'root',
})
export class EditionCopyStatusService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'edition-copy-status';

  getAll(): Observable<ApiResponseModel<EditionCopyStatusModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<EditionCopyStatusModel[]>>(
      `${this.endpoint}`
    );
  } 
}
