import { Component, Input } from '@angular/core';
import { Book } from '@shared/models/book';
import { RouterLink } from "@angular/router";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-book-card-component',
  imports: [
    RouterLink, 
    NgOptimizedImage
  ],
  templateUrl: './book-card-component.html',
})
export class BookCardComponent {
  @Input() book?: Book;

  get bookRouterLink(): any[] {
    return this.book ? ['/library/book', this.book.id] : [];
  }

  get coverImageUrl(): string {
    return this.book ? `/images/test/${this.book.coverImageUrl}` : '';
  }
}
