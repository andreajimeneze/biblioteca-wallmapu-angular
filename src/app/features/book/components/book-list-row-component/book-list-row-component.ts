import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { BookModel } from '@features/book/models/book-model';

@Component({
  selector: 'app-book-list-row-component',
  imports: [
    DatePipe,
    NgOptimizedImage,
  ],
  templateUrl: './book-list-row-component.html',
})
export class BookListRowComponent {
  private readonly router = inject(Router);
  
  readonly bookModel = input.required<BookModel>();
  readonly delete = output<BookModel>();
  readonly edit = output<BookModel>();

  protected onDelete(item: BookModel): void {
    this.delete.emit(item);
  }

  protected onEdit(item: BookModel): void {
    this.edit.emit(item);
  }
}
