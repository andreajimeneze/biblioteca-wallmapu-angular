import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '@features/news/services/news-service';
import { catchError, map, of } from 'rxjs';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { NewsDetailComponent } from "@features/news/components/news-detail-component/news-detail-component";
import { NewsDetailGalleryComponent } from "@features/news/components/news-detail-gallery-component/news-detail-gallery-component";

@Component({
  selector: 'app-news-detail-page',
  imports: [
    MessageErrorComponent,
    NewsDetailComponent,
    NewsDetailGalleryComponent
],
  templateUrl: './news-detail-page.html',
})
export class NewsDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly newsService = inject(NewsService);

  readonly paramId = toSignal(
    this.route.paramMap.pipe(
      map(params => Number(params.get('id')))
    ),
    { initialValue: 0 }
  );

  private readonly newsRX = rxResource({
    params: () => this.paramId(),
    stream: ({ params }) => {    
      if (!params) return of(null);

      return this.newsService.getById(
        params
      ).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  readonly isLoading = computed(() => this.newsRX.isLoading());
  readonly errorMessage = computed(() => this.newsRX.error()?.message ? this.newsRX.error()!.message : null );
  readonly newsWithImages = computed(() => this.newsRX.value() );

}
