import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { BookModel } from '@core/models/book-model';

@Component({
  selector: 'app-book-details-component',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './book-details-component.html',
})
export class BookDetailsComponent {
  book = input.required<BookModel>();
}
