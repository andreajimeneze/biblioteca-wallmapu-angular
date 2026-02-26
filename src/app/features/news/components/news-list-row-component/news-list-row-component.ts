import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-news-list-row-component',
  imports: [
    NgOptimizedImage,
    DatePipe,
  ],
  templateUrl: './news-list-row-component.html',
})
export class NewsListRowComponent {
  private readonly router = inject(Router);
  
  readonly newsWithImages = input.required<NewsWithImagesModel>();
  readonly delete = output<NewsWithImagesModel>();
  readonly edit = output<NewsWithImagesModel>();

  protected onDelete(item: NewsWithImagesModel): void {
    this.delete.emit(item);
  }

  protected onEdit(item: NewsWithImagesModel): void {
    this.edit.emit(item);
  }
}
