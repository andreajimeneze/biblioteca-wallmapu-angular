import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { GenreModel } from '@features/book-genre/models/genre-model';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'genre';

  getAll(): Observable<ApiResponseModel<GenreModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<GenreModel[]>>(
      `${this.endpoint}`
    );
  } 
}
