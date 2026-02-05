import { Component, input } from '@angular/core';
import { News } from '@shared/models/news';
import { NewsCardComponent } from "@shared/components/news-card-component/news-card-component";
import { NewsSkeletonComponent } from "../news-skeleton-component/news-skeleton-component";

@Component({
  selector: 'app-news-list-component',
  imports: [
    NewsCardComponent,
    NewsSkeletonComponent
],
  templateUrl: './news-list-component.html',
})
export class NewsListComponent {
  readonly newsList = input.required<News[]>();
  readonly loading = input<boolean | null>(false);
}
