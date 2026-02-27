import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { AuthorModel } from '@features/book-author/models/author-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'author';

  getAll(): Observable<ApiResponseModel<AuthorModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<AuthorModel[]>>(
      `${this.endpoint}`
    );
  } 
}
