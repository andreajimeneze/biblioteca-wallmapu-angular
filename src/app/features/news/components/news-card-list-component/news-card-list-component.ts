import { Component, input } from '@angular/core';
import { NewsWithImagesModel } from '@core/models/news-model';
import { NewsCardComponent } from "@features/news/components/news-card-component/news-card-component";

@Component({
  selector: 'app-news-card-list-component',
  imports: [NewsCardComponent],
  templateUrl: './news-card-list-component.html',
})
export class NewsCardListComponent {
  readonly isLoading = input<boolean | null>(true);
  readonly newsWithImagesList = input.required<NewsWithImagesModel[]>();
}
