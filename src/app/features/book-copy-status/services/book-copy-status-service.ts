import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { BookCopyStatusModel } from '@features/book-copy-status/models/book-copy-status-model';

@Injectable({
  providedIn: 'root',
})
export class BookCopyStatusService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'copy-status';

  getAll(): Observable<ApiResponseModel<BookCopyStatusModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<BookCopyStatusModel[]>>(
      `${this.endpoint}`
    );
  } 
}
