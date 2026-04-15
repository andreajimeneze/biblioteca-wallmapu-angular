import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { BookDetailModel, BookModel, CreateBookModel, UpdateBookModel } from '@features/book/models/book-model';
import { PaginationModel } from '@core/models/pagination-model';
import { BookPaginationRequestModel } from '@features/book/models/book-pagination-request-model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'books';

  getAllPagination(params: BookPaginationRequestModel): Observable<ApiResponseModel<PaginationModel<BookDetailModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search.trim() != '')
      path = `${path}&search=${params.search}`
  
    if (params.id_author > 0)
      path = `${path}&id_author=${params.id_author}`
  
    if (params.id_editorial > 0)
      path = `${path}&id_editorial=${params.id_editorial}`
  
    if (params.id_genre > 0)
      path = `${path}&id_genre=${params.id_genre}`
  
    return this.apiResponseService.getAll<ApiResponseModel<PaginationModel<BookDetailModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getDetailById(id: number): Observable<ApiResponseModel<BookDetailModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<BookDetailModel | null>>(
      `${this.endpoint}/detail`, id
    );
  }

  getById(id: number): Observable<ApiResponseModel<BookModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<BookModel | null>>(
      this.endpoint, id
    );
  }

  create(item: CreateBookModel): Observable<ApiResponseModel<BookModel>> {
    return this.apiResponseService.create<ApiResponseModel<BookModel>, CreateBookModel>(
      this.endpoint, item
    );
  }  

  update(id: number, item: UpdateBookModel): Observable<ApiResponseModel<BookModel>> {
    return this.apiResponseService.update<ApiResponseModel<BookModel>, UpdateBookModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }
}
