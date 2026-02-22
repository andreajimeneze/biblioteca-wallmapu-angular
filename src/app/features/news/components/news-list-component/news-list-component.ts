import { Component, input, output } from '@angular/core';
import { NewsListRowComponent } from "../news-list-row-component/news-list-row-component";
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-news-list-component',
  imports: [NewsListRowComponent, LoadingComponent],
  templateUrl: './news-list-component.html',
})
export class NewsListComponent {
  readonly newsWithImagesList = input.required<NewsWithImagesModel[]>();
  readonly isLoading = input.required<boolean>();
  readonly delete = output<NewsWithImagesModel>();
}
