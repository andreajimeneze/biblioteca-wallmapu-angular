import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsModel } from '@core/models/news-model';
import { ROUTES } from '@shared/constants/routes';

@Component({
  selector: 'app-news-card-component',
  imports: [
    RouterLink,
    NgOptimizedImage,
  ],
  templateUrl: './news-card-component.html',
})
export class NewsCardComponent {
  readonly news = input.required<NewsModel>();

  newsRouterLink = computed(() => ROUTES.NEWS.DETAIL(this.news().id_news));
}