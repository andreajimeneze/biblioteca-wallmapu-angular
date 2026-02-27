import { Component, input, output } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { BookListRowComponent } from "@features/book/components/book-list-row-component/book-list-row-component";
import { BookModel } from '@features/book/models/book-model';

@Component({
  selector: 'app-book-list-component',
  imports: [
    LoadingComponent, 
    BookListRowComponent
  ],
  templateUrl: './book-list-component.html',
})
export class BookListComponent {
  readonly bookList = input.required<BookModel[]>();
  readonly isLoading = input.required<boolean>();
  
  readonly edit = output<BookModel>();
  readonly delete = output<BookModel>();

  protected onEdit(item: BookModel): void {
    this.edit.emit(item);
  }

  protected onDelete(item: BookModel): void {
    this.delete.emit(item);
  }
}
