import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-news-card-component',
  imports: [
    DatePipe,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './news-card-component.html',
})
export class NewsCardComponent {
  readonly newsWithImages = input.required<NewsWithImagesModel>();
  readonly goToNews = computed(() => ROUTES_CONSTANTS.NEWS.DETAIL(this.newsWithImages().id_news));
}
