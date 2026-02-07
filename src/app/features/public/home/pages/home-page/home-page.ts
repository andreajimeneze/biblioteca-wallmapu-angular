import { Component, computed, inject } from '@angular/core';
import { RecommendedBooksComponent } from "@features/public/home/components/recommended-books-component/recommended-books-component";
import { ROUTES } from '@shared/constants/routes';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { NewsService } from '@core/services/news-service';
import { catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NewsListComponent } from "@shared/components/news-list-component/news-list-component";
import { ApiResponseModel } from '@core/models/api-response-model';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { NewsModel } from '@core/models/news-model';
import { PaginationModel } from '@core/models/pagination-model';

@Component({
  selector: 'app-home-page',
  imports: [
    RecommendedBooksComponent,
    HeaderComponent,
    SectionHeaderComponent,
    NewsListComponent,
    MessageErrorComponent
],
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly ROUTES = ROUTES;
  private newsService = inject(NewsService);
  
  private readonly defaultApiResponse: ApiResponseModel<PaginationModel<NewsModel[]>> = {
    isSuccess: true,
    statusCode: 0,
    message: "",
    result: {
      count: 0,
      pages: 0,
      next: '',
      prev: '',
      result: [] 
    }
  }

  private newsSignal = toSignal(
    this.newsService.getTop3().pipe(
      catchError((err) => {
        console.error('Error cargando libros:', err);
        return of(this.defaultApiResponse);
      })
    ),
    { initialValue: undefined }
  );

  newsResult = computed(() => this.newsSignal() ?? this.defaultApiResponse);
  loading = computed(() => this.newsSignal() === undefined);  
}
