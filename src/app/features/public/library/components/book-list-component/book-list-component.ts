import { Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '@core/services/book-service';
import { Book } from '@shared/models/book';
import { BookCardComponent } from '../book-card-component/book-card-component';

@Component({
  selector: 'app-book-list-component',
  imports: [
    BookCardComponent,
  ],
  templateUrl: './book-list-component.html',
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  
  books = signal<Book[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    
    // Llamar al servicio
    this.bookService.getAll().subscribe({
      next: (books) => {
        this.books.set(books);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando libros:', err);
        this.loading.set(false);
      }
    });
  }
}
