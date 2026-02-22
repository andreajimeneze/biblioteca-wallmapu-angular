import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/helpers/api-response-service';
import { ApiResponseModel } from '@core/models/api-response-model';
import { Observable } from 'rxjs';
import { NewsGalleryModel } from '@features/news-gallery/models/news-gallery-model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'news-gallery';

  create(news_id: number, files: File[], alts: string[]): Observable<ApiResponseModel<NewsGalleryModel[]>> {
    const formData = new FormData();

    files.forEach(file => {
      formData.append('files', file);
    });
  
    alts.forEach(alt => {
      formData.append('alts', alt);
    });
    
    return this.apiResponseService.create<ApiResponseModel<NewsGalleryModel[]>, FormData>(
      `${this.endpoint}/news/${news_id}`, formData
    );
  }

  delete(id: number): Observable<ApiResponseModel<string>> {
    return this.apiResponseService.delete<ApiResponseModel<string>>(
      this.endpoint, id
    );
  }
}
