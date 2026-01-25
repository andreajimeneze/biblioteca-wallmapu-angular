import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NewsService } from '@core/services/news-service';
import { News } from '@shared/models/news';
import { RouterLink } from "@angular/router";
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-latest-news-component',
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './latest-news-component.html',
})
export class LatestNewsComponent {
  private newsService = inject(NewsService);
  
  private errorMessage = signal<string | null>(null);
  
  private newsResult = toSignal(
    this.newsService.getLast3().pipe(
      catchError((err) => {
        console.error('Error cargando noticias:', err);
        this.errorMessage.set('No se pudieron cargar las noticias. Por favor, intenta más tarde.');
        return of([] as News[]);
      })
    ),
    { initialValue: [] as News[] }
  );

  news = computed(() => this.newsResult() ?? []);
  loading = computed(() => this.newsResult() === undefined);
  error = computed(() => this.errorMessage());
}
