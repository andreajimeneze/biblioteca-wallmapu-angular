import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookModel } from '@features/book/models/book-model';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

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
  
  navigateGoToDitail = computed(() => ROUTES_CONSTANTS.HOME.BOOK.DETAIL(this.book().id_book));
}
