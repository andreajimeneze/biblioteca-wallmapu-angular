import { Component, computed, inject, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '@features/book/services/book-service';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { BookDetailModel } from '@features/book/models/book-detail-model';
import { AuthStore } from '@features/auth/services/auth-store';
import { EditionDetailModel } from '@features/edition/models/edition-detail-model';
import { NgOptimizedImage } from '@angular/common';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { CreateReservationModel } from '@features/reservation/models/reservation-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { BookEditionCopyVM } from '@features/home/view-models/BookEditionCopyVM';
import { EditionCopyDetailModel } from '@features/edition-copy/models/edition-copy-detail-model';
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";

@Component({
  selector: 'app-book-detail-page',
  imports: [
    NgOptimizedImage,
    LoadingComponent,
    ModalActionComponent,
    MessageSuccessComponent,
    MessageErrorComponent,
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

  private readonly viewportScroller = inject(ViewportScroller);
  private readonly authStore = inject(AuthStore);
  private readonly bookService = inject(BookService);
  private readonly reservationService = inject(ReservationService);

  protected readonly isLoading = computed<boolean>(() => 
    [
      this.getBookRX,
      this.createReservationRX,
    ].some(r => r.isLoading())
  ); 

  protected readonly computedBookDetail = computed<BookDetailModel | null>(() => this.getBookRX.value() ?? null);
  
  private readonly getBookPayload = signal<number>(this.bookId());
  private readonly createReservationPayload = signal<CreateReservationModel | null>(null);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly isAuthenticated = computed<boolean>(() => this.authStore.isAuthenticated());
  protected readonly isReservationModalOpen = signal<boolean>(false);

  protected readonly selectedCopyId = signal<number>(0);
  protected readonly selectedEditionId = signal<number>(this.editionId() ?? 0);
  protected readonly vmBookEditionCopy = computed<BookEditionCopyVM | null>(() => {
    const editions = this.computedBookDetail()?.editions;
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


  private readonly getBookRX = rxResource({
    params: () => this.getBookPayload(),
    stream: ({ params: id_book }) => {
      if (!id_book) return of(null);

      return this.bookService.getById(id_book).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => this.handleError(err))
      );
    }
  });

  protected readonly createReservationRX = rxResource({
    params: () => this.createReservationPayload(),
    stream: ({ params: id_copy }) => {
      if (!id_copy) return of(null);

      return this.reservationService.create(id_copy).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          this.errorMessage.set(null);
          return response.result;
        }),
        tap(() => {
          this.getBookRX.reload();
        }),
        catchError(err => {
          this.successMessage.set(null);
          return this.handleError(err);
        }),
        finalize(() => {
          this.isReservationModalOpen.set(false);
        })
      );
    }
  });

  protected openReservationModal(): void {
    this.isReservationModalOpen.set(true);
  }

  protected closeReservationModal(): void {
    this.isReservationModalOpen.set(false);
  }

  protected createReservation(): void {
    const copyId = this.vmBookEditionCopy()?.copy?.id_copy;
    if (!copyId) {
      this.errorMessage.set('Error en la reserva');
      return;
    }
    this.createReservationPayload.set({ copy_id: copyId });
  }

  protected selectNewCopy(edition: EditionDetailModel,  copy: EditionCopyDetailModel): void {
    this.selectedEditionId.set(edition.id_edition);
    this.selectedCopyId.set(copy.id_copy);
    this.viewportScroller.scrollToPosition([0, 0]);
  };

  private handleError(err: unknown) {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.errorMessage.set(message);
    return of(null);
  }
}
