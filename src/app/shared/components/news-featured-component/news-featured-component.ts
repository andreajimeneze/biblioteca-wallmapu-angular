import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NewsWithImagesModel } from '@core/models/news-model';
import { ROUTES } from '@shared/constants/routes';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-news-featured-component',
  imports: [
    DatePipe,
    RouterLink,
    NgOptimizedImage
],
  templateUrl: './news-featured-component.html',
})
export class NewsFeaturedComponent {
  readonly news = input.required<NewsWithImagesModel>();
  readonly loading = input<boolean | null>(true);
  newsRouterLink = computed(() => ROUTES.NEWS.DETAIL(this.news().id_news));
}
