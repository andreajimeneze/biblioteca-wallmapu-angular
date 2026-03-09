import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { BookDetailModel } from '@features/book/models/book-detail-model';

@Component({
  selector: 'app-book-detail-component',
  imports: [
    //NgOptimizedImage,
  ],
  templateUrl: './book-detail-component.html',
})
export class BookDetailComponent {
  readonly bookModel = input<BookDetailModel | null>(null);
  
}
