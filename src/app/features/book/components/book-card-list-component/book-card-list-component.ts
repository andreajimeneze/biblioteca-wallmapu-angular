import { Component, input } from '@angular/core';
import { BookModel } from '@features/book/models/book-model';
import { BookCardComponent } from "@features/book/components/book-card-component/book-card-component";

@Component({
  selector: 'app-book-card-list-component',
  imports: [
    BookCardComponent
],
  templateUrl: './book-card-list-component.html',
})
export class BookCardListComponent {
  readonly bookList = input.required<BookModel[]>();
  readonly isLoading = input.required<boolean>();
}
