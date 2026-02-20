import { Component, computed, inject } from '@angular/core';
import { RecommendedBooksComponent } from "@features/public/home/components/recommended-books-component/recommended-books-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NewsService } from '@core/services/news-service';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { NewsListComponent } from "@shared/components/news-list-component/news-list-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { API_RESPONSE_PAGINATION_NEWS_LIST } from '@shared/constants/default-api-result';
import { AboutComponent } from "@shared/components/about-component/about-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { NewsFeaturedComponent } from "@shared/components/news-featured-component/news-featured-component";

@Component({
  selector: 'app-home-page',
  imports: [
    RecommendedBooksComponent,
    HeaderComponent,
    SectionHeaderComponent,
    NewsListComponent,
    MessageErrorComponent,
    AboutComponent,
    PaginationComponent,
    NewsFeaturedComponent
],
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly ROUTES = ROUTES_CONSTANTS;
  private newsService = inject(NewsService);
  private readonly defaultApiResponse = API_RESPONSE_PAGINATION_NEWS_LIST;

  private newsSignal = toSignal(
    this.newsService.getAll(1,4,'').pipe(
      catchError((err) => {
        console.error('Error cargando noticia:', err);
        return of({
          ...this.defaultApiResponse,
          isSuccess: false,
          statusCode: 500,
          message: err?.message || String(err)
        });
      })
    ),
    { initialValue: undefined }
  );

  // ✅ Noticia destacada
  newsFeatured = computed(() => {
    const newsResult = this.newsSignal() ?? this.defaultApiResponse;
    return newsResult.result.result[0]; // solo la primera noticia
  });

  // ✅ Listado de noticias restantes
  newsList = computed(() => {
    const newsResult = this.newsSignal() ?? this.defaultApiResponse;
    return newsResult.result.result.slice(1); // todas menos la primera
  });
  
  newsResult = computed(() => this.newsSignal() ?? this.defaultApiResponse);
  loading = computed(() => this.newsSignal() === undefined);  
}
