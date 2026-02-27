import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '@features/book/services/book-service';
import { catchError, map, of } from 'rxjs';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { BookDetailComponent } from '@features/book/components/book-detail-component/book-detail-component';
import { BookModel } from '@features/book/models/book-model';

@Component({
  selector: 'app-book-detail-page',
  imports: [
    MessageErrorComponent,
    BookDetailComponent
],
  templateUrl: './book-detail-page.html',
})
export class BookDetailPage {
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly paramId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => Number(params.get('id')))
    ),
    { initialValue: 0 }
  );

  private readonly backendError = signal<string | null>(null);
  private readonly bookService = inject(BookService);

  private readonly bookRX = rxResource({
    params: () => this.paramId(),
    stream: ({ params }) => {
      if (!params)  return of(null);
      this.backendError.set(null);

      return this.bookService.getById(params).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.backendError.set(message);
          return of(null);
        })
      );
    },
  });

  protected readonly isLoading = computed<boolean>(() => this.bookRX.isLoading());
  protected readonly errorMessage = computed<string | null>(() => this.backendError() ?? null);
  protected readonly bookComputed = computed<BookModel | null>(() => this.bookRX.value() ?? null)
}
