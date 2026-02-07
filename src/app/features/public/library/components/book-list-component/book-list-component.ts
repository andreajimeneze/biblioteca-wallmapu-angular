import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BookModel } from '@core/models/book-model';
import { BookService } from '@core/services/book-service';
import { BookCardComponent } from '@shared/components/book-card-component/book-card-component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-book-list-component',
  imports: [
    BookCardComponent,
  ],
  templateUrl: './book-list-component.html',
})
export class BookListComponent {
  private bookService = inject(BookService);
  
  private booksResult = toSignal(
    this.bookService.getAll().pipe(
      catchError((err) => {
        console.error('Error cargando libros:', err);
        return of([] as BookModel[]);
      })
    ),
    { initialValue: undefined }
  );

  books = computed(() => this.booksResult() ?? []);
  loading = computed(() => this.booksResult() === undefined);
}
