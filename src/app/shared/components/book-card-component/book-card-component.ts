import { NgOptimizedImage } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '@shared/models/book';

@Component({
  selector: 'app-book-card-component',
  imports: [
    RouterLink, 
    NgOptimizedImage,
  ],
  templateUrl: './book-card-component.html',
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book;

  bookRouterLink = computed<[string, number]>(() => 
    ['/library/book', this.book.id] as [string, number]
  );
}
