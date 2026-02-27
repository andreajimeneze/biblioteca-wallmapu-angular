import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { BookModel } from '@features/book/models/book-model';
import { PaginationModel } from '@core/models/pagination-model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'books';

  getAll(currentPage: number, maxItems:number, search: string = ""): Observable<ApiResponseModel<PaginationModel<BookModel[]>>> {
    return this.apiResponseService.getAll<ApiResponseModel<PaginationModel<BookModel[]>>>(
      `${this.endpoint}/?page=${currentPage}&limit=${maxItems}&search=${search}`
    );
  }  
}
