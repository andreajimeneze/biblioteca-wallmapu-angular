import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { Book } from '@shared/models/book';

@Component({
  selector: 'app-book-details-component',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './book-details-component.html',
})
export class BookDetailsComponent {
  book = input.required<Book>();
}
