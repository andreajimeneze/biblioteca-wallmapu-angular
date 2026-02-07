import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { BookService } from '@core/services/book-service';
import { catchError, of } from 'rxjs';
import { BookCardComponent } from "@shared/components/book-card-component/book-card-component";
import { BookModel } from '@core/models/book-model';

@Component({
  selector: 'app-recommended-books-component',
  imports: [
    RouterModule,
    BookCardComponent
],
  templateUrl: './recommended-books-component.html',
})
export class RecommendedBooksComponent {
  private bookService = inject(BookService);
  
  private booksResult = toSignal(
    this.bookService.getTop12().pipe(
      catchError((err) => {
        console.error('Error cargando libros:', err); // ✅ Solo en consola
        return of([] as BookModel[]); // ✅ Devuelve array vacío silenciosamente
      })
    ),
    { initialValue: undefined } // ✅ valor inicial vacío
  );

  books = computed(() => this.booksResult() ?? []);  // ✅ siempre retorna [] o [libro1, libro2...]
  loading = computed(() => this.booksResult() === undefined); // ✅ true al inicio, false cuando lleg ala respuesta
}