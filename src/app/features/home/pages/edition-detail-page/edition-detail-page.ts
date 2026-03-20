import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BookDetailModel } from '@features/book/models/book-detail-model';
import { BookService } from '@features/book/services/book-service';
import { EditionDetailsWithoutBookModel } from '@features/edition/models/edition-detail-model';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { catchError, map, of, tap } from 'rxjs';

@Component({
  selector: 'app-edition-detail-page',
  imports: [
    NgOptimizedImage,
    MessageErrorComponent
  ],
  templateUrl: './edition-detail-page.html',
})
export class EditionDetailPage {
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly bookId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => Number(params.get('bookId')) || 0)
    ),
    { initialValue: 0 }
  );

  readonly editionId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => Number(params.get('editionId')) || 0)
    ),
    { initialValue: 0 }
  );

  protected readonly selectedEditionId = signal<number>(this.editionId() ?? 0);
  protected readonly selectedEdition = computed<EditionDetailsWithoutBookModel | null>(() => {
    const list = this.bookDetailComputed()?.editions;
  
    return list?.find(item =>
      item.id_edition == this.selectedEditionId()
    ) ?? null;
  });
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() => 
    [
      this.getBookRX,
    ].some(r => r.isLoading())
  );

  private readonly bookService = inject(BookService);
  protected readonly bookDetailComputed = computed<BookDetailModel | null>(() => this.getBookRX.value() ?? null);
  private readonly getBookPayload = signal<number>(this.bookId());

  private readonly getBookRX = rxResource({
    params: () => this.getBookPayload(),
    stream: ({ params: id_book }) => {
      if (!id_book) return of(null);

      return this.bookService.getById(id_book).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  protected selectNewEdition(item: EditionDetailsWithoutBookModel): void {
    this.selectedEditionId.set(item.id_edition)
  };
}
