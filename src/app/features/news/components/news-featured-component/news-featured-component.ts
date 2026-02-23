import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-news-featured-component',
  imports: [
    DatePipe,
    NgOptimizedImage,
    RouterLink
],
  templateUrl: './news-featured-component.html',
})
export class NewsFeaturedComponent {
  readonly newsWithImages = input<NewsWithImagesModel | null>(null)
  readonly goToNews = computed(() => ROUTES_CONSTANTS.NEWS.DETAIL(this.newsWithImages()?.id_news ?? 0));
}

