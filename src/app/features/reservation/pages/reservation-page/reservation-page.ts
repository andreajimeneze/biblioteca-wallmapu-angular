import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationFilterModel, ReservationModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { catchError, finalize, map, of, tap } from 'rxjs';
import { ReservationListComponents } from "@features/reservation/components/reservation-list-components/reservation-list-components";
import { ReservationStatusService } from '@features/reservation-status/services/reservation-status-service';
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Component({
  selector: 'app-reservation-page',
  imports: [
    SectionHeaderComponent,
    ReservationListComponents,
    ModalActionComponent,
    MessageErrorComponent,
    MessageSuccessComponent
  ],
  templateUrl: './reservation-page.html',
})
export class ReservationPage {
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly selectStatusId = signal<number>(0);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');

  private readonly reservationStatusService = inject(ReservationStatusService);
  protected readonly computedReservationStatusList = computed<ReservationStatusModel[]>(() => [
    { id_status: 0, name: 'Todos los Estados' },
    ...this.getReservationStatusRX.value() ?? []
  ]);

  private readonly reservationService = inject(ReservationService);
  private readonly getPaginationPayload = computed<PaginationRequestModel<ReservationFilterModel>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
      filter: {
        id_status: this.selectStatusId(),
      }
    }
  });
  private readonly cancelReservationPayload = signal<number | null>(null);
  private readonly cancelReservationTemp = signal<number | null>(null);
  protected readonly computedPaginationAndReservationList = computed<PaginationResponseModel<ReservationModel[]> | null>(() => this.getReservationRX.value() ?? null);

  protected readonly isLoading = computed(() => 
    [
      this.getReservationStatusRX,
      this.getReservationRX,
      this.cancelReservationRX,
      this.updateExpiredReservationRX,
    ].some(e => e.isLoading())
  );

  private readonly getReservationStatusRX = rxResource({
    stream: () => {    
      return this.reservationStatusService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });    

  private readonly getReservationRX = rxResource({
    params: () => this.getPaginationPayload(),
    stream: ({ params }) => { 

      return this.reservationService.getAllPagination(params).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly cancelReservationRX = rxResource({
    params: () => this.cancelReservationPayload(),
    stream: ({ params: id_reservation }) => {    
      if (!id_reservation) return of(null);

      return this.reservationService.cancel(id_reservation).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        tap(() => {
          this.reloadReservation();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        }),
        finalize(() => {
          this.closeModal();
        })
      );
    },
  });

  private readonly updateExpiredReservationRX = rxResource({
    stream: () => {    
      return this.reservationService.expire().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        tap(() => {
          this.reloadReservation();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  protected reloadReservation(): void {
    this.getReservationRX.reload();
  }

  protected onUpdateExpireReservation(): void {
    this.updateExpiredReservationRX.reload();
  }

  protected onFilterByIdStatus(id: number): void {
    this.selectStatusId.set(id);
  }

  nextPage() {
    const totalPages = this.computedPaginationAndReservationList()?.pages ?? 1

    if (this.currentPage() < totalPages){
      this.currentPage.update(e => e + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }

  protected onCancelReservation(id_reservation: number): void {
    this.cancelReservationTemp.set(id_reservation);
    this.isModalOpen.set(true);
  }

  protected onConfirmCancelReservation(): void {
    this.cancelReservationPayload.set(this.cancelReservationTemp());
  }

  protected closeModal(): void {
    this.cancelReservationTemp.set(null);
    this.cancelReservationPayload.set(null);
    this.isModalOpen.set(false);
  }

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.successMessage.set(null);
    this.errorMessage.set(message);
  }
}
