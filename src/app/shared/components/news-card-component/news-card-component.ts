import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsWithImagesModel } from '@core/models/news-model';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-news-card-component',
  imports: [
    RouterLink,
    NgOptimizedImage,
    DatePipe,
  ],
  templateUrl: './news-card-component.html',
})
export class NewsCardComponent {
  readonly news = input.required<NewsWithImagesModel>();
  newsRouterLink = computed(() => ROUTES_CONSTANTS.NEWS.DETAIL(this.news().id_news));
}