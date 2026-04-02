import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '@features/book/services/book-service';
import { catchError, map, of } from 'rxjs';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { BookDetailModel } from '@features/book/models/book-detail-model';
import { AuthStore } from '@features/auth/services/auth-store';
import { EditionDetailModel } from '@features/edition/models/edition-detail-model';
import { NgOptimizedImage } from '@angular/common';
import { ReservationBtnCreateComponents } from "@features/reservation/components/reservation-btn-create-components/reservation-btn-create-components";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { BookEditionCopyVM } from '@features/home/view-models/BookEditionCopyVM';
import { EditionCopyDetailModel } from '@features/edition-copy/models/edition-copy-detail-model';

@Component({
  selector: 'app-book-detail-page',
  imports: [
    NgOptimizedImage,
    MessageErrorComponent,
    ReservationBtnCreateComponents,
    LoadingComponent
],
  templateUrl: './book-detail-page.html',
})
export class BookDetailPage {
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

  private readonly authStore = inject(AuthStore);
  protected readonly isAuthenticated = computed<boolean>(() => this.authStore.isAuthenticated());

  protected readonly selectedCopyId = signal<number>(0);
  protected readonly selectedEditionId = signal<number>(this.editionId() ?? 0);
  protected readonly vmBookEditionCopy = computed<BookEditionCopyVM | null>(() => {
    const editions = this.bookDetailComputed()?.editions;
    const edition = editions?.find(item => item.id_edition === this.selectedEditionId());
    if (!edition) return null;
  
    const copies = edition.copies || [];
    const copyId = this.selectedCopyId();
  
    const copy =
      copyId !== 0
        ? copies.find(c => c.id_copy === copyId) || null
        : copies.find(c => c.status?.id_status === 1) || copies[0] || null;
  
    if (!copy) return null;
  
    const { copies: _, ...editionWithoutCopies } = edition;
  
    return {
      ...editionWithoutCopies,
      copy
    } as BookEditionCopyVM;
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

  protected selectNewCopy(edition: EditionDetailModel,  copy: EditionCopyDetailModel): void {
    this.selectedEditionId.set(edition.id_edition);
    this.selectedCopyId.set(copy.id_copy);

    window.scrollTo({
      top: 0,
      behavior: 'smooth' // animación suave
    });
  };
}
