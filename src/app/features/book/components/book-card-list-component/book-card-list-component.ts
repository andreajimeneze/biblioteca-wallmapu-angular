import { Component, input } from '@angular/core';
import { BookDetailModel } from '@features/book/models/book-detail-model';
import { BookCardComponent } from "@features/book/components/book-card-component/book-card-component";

@Component({
  selector: 'app-book-card-list-component',
  imports: [
    BookCardComponent
],
  templateUrl: './book-card-list-component.html',
})
export class BookCardListComponent {
  readonly bookList = input.required<BookDetailModel[]>();
  readonly isLoading = input.required<boolean>();
}
