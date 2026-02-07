import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookModel } from '@core/models/book-model';
import { ROUTES } from '@shared/constants/routes';

@Component({
  selector: 'app-book-card-component',
  imports: [
    RouterLink, 
    NgOptimizedImage,
  ],
  templateUrl: './book-card-component.html',
})
export class BookCardComponent {
  readonly book = input.required<BookModel>();
  
  bookRouterLink = computed(() => ROUTES.LIBRARY.BOOK(this.book().id));
}
