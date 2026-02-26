import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { EditorialModel } from '@features/book-editorial/models/editorial-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditorialService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'book-editorial';

  getAll(): Observable<ApiResponseModel<EditorialModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<EditorialModel[]>>(
      `${this.endpoint}`
    );
  } 
}
