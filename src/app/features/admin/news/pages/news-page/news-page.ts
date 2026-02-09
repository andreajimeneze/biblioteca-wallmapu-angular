import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NewsService } from '@core/services/news-service';
import { catchError, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { NewsModel } from '@core/models/news-model';

@Component({
  selector: 'app-news-page',
  imports: [
    NgOptimizedImage,
    LoadingComponent,
],
  templateUrl: './news-page.html',
})
export class NewsPage {
  private newsService = inject(NewsService);
  
  private newsResult = toSignal(
    this.newsService.getAllTemp().pipe(
      catchError((err) => {
        console.error('Error cargando noticias:', err);
        return of([] as NewsModel[]);
      })
    ),
    { initialValue: undefined }
  );

  news = computed(() => this.newsResult() ?? []);
  loading = computed(() => this.newsResult() === undefined);
}
