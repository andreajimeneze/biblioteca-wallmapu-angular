import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { BookModel } from '@features/book/models/book-model';

@Component({
  selector: 'app-book-detail-component',
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './book-detail-component.html',
})
export class BookDetailComponent {
  readonly bookModel = input<BookModel | null>(null);
  
}
