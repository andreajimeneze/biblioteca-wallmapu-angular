import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';

@Component({
  selector: 'app-news-detail-component',
  imports: [
    DatePipe,
    NgOptimizedImage,
  ],
  templateUrl: './news-detail-component.html',
})
export class NewsDetailComponent {
  readonly newsWithImages = input<NewsWithImagesModel | null>(null)
}
