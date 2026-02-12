import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { NewsWithImagesModel } from '@core/models/news-model';
import { ROUTES } from '@shared/constants/routes';

@Component({
  selector: 'app-news-table-row-component',
  imports: [
    NgOptimizedImage,
    DatePipe,
  ],
  templateUrl: './news-table-row-component.html',
})
export class NewsTableRowComponent {
  private readonly router = inject(Router);
  
  readonly news = input.required<NewsWithImagesModel>();
  readonly delete = output<NewsWithImagesModel>();

  protected onDelete(item: NewsWithImagesModel): void {
    this.delete.emit(item);
  }

  protected onEdit(item: NewsWithImagesModel): void {
    this.router.navigate([ROUTES.PROTECTED.ADMIN.NEWS, 'form'], { state: { url: item } });
  }
}
