import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '@core/services/book-service';
import { BookDetailsComponent } from "@features/public/library/components/book-details-component/book-details-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-book-details-page',
  imports: [
    CommonModule,
    BookDetailsComponent,
    MessageErrorComponent
],
  templateUrl: './book-details-page.html',
})
export class BookDetailsPage {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  
  // ✅ Reactividad moderna con toSignal
  private bookResult = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.bookService.getById(id).pipe(
          catchError(() => of(null))
        );
      })
    ),
    { initialValue: null }
  );
  
  // ✅ Estados computados claros
  book = computed(() => this.bookResult());
  loading = computed(() => this.bookResult() === null);
}