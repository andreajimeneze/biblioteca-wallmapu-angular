import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { EditionCopyModel } from '@features/edition-copy/models/edition-copy-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditionCopyService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'edition-copy';

  getById(id: number): Observable<ApiResponseModel<EditionCopyModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<EditionCopyModel | null>>(
      this.endpoint, id
    );
  }
}
