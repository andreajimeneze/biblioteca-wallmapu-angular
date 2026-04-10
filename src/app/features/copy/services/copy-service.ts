import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { CopyAvailabilityModel, CopyWithStatusModel, CreateCopyModel, UpdateCopyModel } from '@features/copy/models/copy-model';

@Injectable({
  providedIn: 'root',
})
export class CopyService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'copy';

  getAll(): Observable<ApiResponseModel<CopyWithStatusModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<CopyWithStatusModel[]>>(
      this.endpoint
    );
  }

  getById(id: number): Observable<ApiResponseModel<CopyWithStatusModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<CopyWithStatusModel | null>>(
      this.endpoint, id
    );
  }

  getAllByEditionId(id: number): Observable<ApiResponseModel<CopyWithStatusModel[]>> {
    return this.apiResponseService.getById<ApiResponseModel<CopyWithStatusModel[]>>(
      `${this.endpoint}/edition`, id
    );
  }

  getAllByBookId(id: number): Observable<ApiResponseModel<CopyAvailabilityModel[]>> {
    return this.apiResponseService.getById<ApiResponseModel<CopyAvailabilityModel[]>>(
      `${this.endpoint}/book`, `${id}/available`
    );
  }  

  create(item: CreateCopyModel): Observable<ApiResponseModel<CopyWithStatusModel>> {
    return this.apiResponseService.create<ApiResponseModel<CopyWithStatusModel>, CreateCopyModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateCopyModel): Observable<ApiResponseModel<CopyWithStatusModel>> {
    return this.apiResponseService.update<ApiResponseModel<CopyWithStatusModel>, UpdateCopyModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }
}
