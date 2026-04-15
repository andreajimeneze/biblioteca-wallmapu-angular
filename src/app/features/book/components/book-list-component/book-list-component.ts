import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { BookListRowComponent } from "@features/book/components/book-list-row-component/book-list-row-component";
import { BookDetailModel } from '@features/book/models/book-model';


@Component({
  selector: 'app-book-list-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingComponent, 
    BookListRowComponent
  ],
  templateUrl: './book-list-component.html',
})
export class BookListComponent {
  readonly bookList = input.required<BookDetailModel[]>();
  readonly isLoading = input.required<boolean>();
  
  readonly edit = output<BookDetailModel>();
  readonly delete = output<BookDetailModel>();

  protected onEdit(item: BookDetailModel): void {
    this.edit.emit(item);
  }

  protected onDelete(item: BookDetailModel): void {
    this.delete.emit(item);
  }
}
