import { Component, computed, effect, inject, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '@features/book/services/book-service';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { AuthStore } from '@features/auth/services/auth-store';
import { NgOptimizedImage } from '@angular/common';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { CreateReservationModel } from '@features/reservation/models/reservation-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { BookModel } from '@features/book/models/book-model';
import { EditionCopyService } from '@features/edition-copy/services/edition-copy-service';
import { CopyModel } from '@features/edition-copy/models/edition-copy-model';

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

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly viewportScroller = inject(ViewportScroller);
  private readonly authStore = inject(AuthStore);
  private readonly bookService = inject(BookService);
  private readonly copyService = inject(EditionCopyService);
  private readonly reservationService = inject(ReservationService);
  
  protected readonly isAuthenticated = computed<boolean>(() => this.authStore.isAuthenticated());
  protected readonly isReservationModalOpen = signal<boolean>(false);
  private readonly firstLoadEffect = effect(() => {
    const copyList = this.computedCopyList();
    const editionId = this.editionId();
    const current = this.selectedCopy();
  
    if (!copyList.length) return;
  
    // 🔁 Si ya hay selección → intentar actualizarla con datos frescos
    if (current) {
      const updated = copyList.find(c => c.id_copy === current.id_copy);
  
      // ✔️ Si existe, actualiza referencia (esto refresca UI)
      if (updated) {
        this.selectedCopy.set(updated);
        return;
      }
    }
  
    // 🆕 Si no hay selección o ya no existe → elegir una nueva
    const filtered = copyList.filter(
      e => e.edition.id_edition === editionId
    );
  
    const copyAvailable =
      filtered.find(e => e.availability_status === 'disponible') ||
      filtered[0] ||
      null;
  
    if (copyAvailable) {
      this.selectedCopy.set(copyAvailable);
    }
  });
  protected readonly selectedEditionId = signal<number>(this.editionId());
  protected readonly selectedCopy = signal<CopyModel | null>(null);

  protected readonly isLoadingBook = computed<boolean>(() => this.getBookRX.isLoading());
  protected readonly isLoadingCopy = computed<boolean>(() => 
    [
      this.getCopyRX,
      this.createReservationRX,
    ].some(r => r.isLoading())
  ); 
  protected readonly computedBook = computed<BookModel | null>(() => this.getBookRX.value() ?? null);
  protected readonly computedCopyList = computed<CopyModel[]>(() => this.getCopyRX.value() ?? []);
  private readonly getBookPayload = signal<number>(this.bookId());
  private readonly createReservationPayload = signal<CreateReservationModel | null>(null);
  
  private readonly getBookRX = rxResource({
    params: () => this.getBookPayload(),
    stream: ({ params: id_book }) => {
      if (!id_book) return of(null);

      return this.bookService.getById(id_book).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError((err) => {
          this.handleError(err)
          return of(null);
        }),
      );
    }
  });

  private readonly getCopyRX = rxResource({
    params: () => this.getBookPayload(),
    stream: ({ params: id_book }) => {
      if (!id_book) return of(null);

      return this.copyService.getAllByIdBook(id_book).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError((err) => {
          this.handleError(err)
          return of(null);
        }),
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
          this.handleSuccess(response.message)
          return response.result;
        }),
        tap(() => {
          this.getCopyRX.reload();
        }),
        catchError((err) => {
          this.handleError(err)
          return of(null);
        }),
        finalize(() => this.isReservationModalOpen.set(false)),
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
    const copyId = this.selectedCopy()?.id_copy;
    if (!copyId) {
      this.errorMessage.set('Error en la reserva');
      return;
    }
    this.createReservationPayload.set({ copy_id: copyId });
  }

  protected selectNewCopy(copy: CopyModel): void {
    this.selectedCopy.set(copy);
    this.viewportScroller.scrollToPosition([0, 0]);
  };

  private handleSuccess(msge: string) {
    this.successMessage.set(msge);
    this.errorMessage.set(null);
  }

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.errorMessage.set(message);
    this.successMessage.set(null);
  }
}
