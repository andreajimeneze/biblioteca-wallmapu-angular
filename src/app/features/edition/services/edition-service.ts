import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { EditionModel } from '@features/edition/models/edition-model';
import { EditionFormModel } from '../models/edition-form-model';

@Injectable({
  providedIn: 'root',
})
export class EditionService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'edition';

  getById(id: number): Observable<ApiResponseModel<EditionModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<EditionModel | null>>(
      this.endpoint, id
    );
  }

  create(item: EditionFormModel): Observable<ApiResponseModel<EditionModel>> {
    return this.apiResponseService.create<ApiResponseModel<EditionModel>, EditionFormModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: EditionFormModel): Observable<ApiResponseModel<EditionModel>> {
    return this.apiResponseService.update<ApiResponseModel<EditionModel>, EditionFormModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }
}
