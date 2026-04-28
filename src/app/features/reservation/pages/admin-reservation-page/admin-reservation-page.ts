import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ReservationFilterModel, ReservationModel, ReservationPickupModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { ReservationListComponents } from "@features/reservation/components/reservation-list-components/reservation-list-components";
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";
import { ReservationToLoanComponents } from "@features/reservation/components/reservation-to-loan-components/reservation-to-loan-components";
import { LoanPolicyComponent } from "@features/loan-policies/components/loan-policy-component/loan-policy-component";

@Component({
  selector: 'app-admin-reservation-page',
  imports: [
    SectionHeaderComponent,
    MessageSuccessComponent,
    MessageErrorComponent,
    ReservationListComponents,
    ModalActionComponent,
    ReservationToLoanComponents,
    LoanPolicyComponent
  ],
  templateUrl: './admin-reservation-page.html',
})
export class AdminReservationPage {
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly selectStatusId = signal<number>(0);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');

  private readonly reservationService = inject(ReservationService);
  private readonly pickupReservationPayload = signal<ReservationPickupModel | null>(null);
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
      this.getReservationRX,
      this.cancelReservationRX,
      this.updateExpiredReservationRX,
      this.pickupReservationRX,
    ].some(e => e.isLoading())
  );

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

  private readonly pickupReservationRX = rxResource({
    params: () => this.pickupReservationPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);
      this.errorMessage.set(null);
      
      return this.reservationService.pickup(params).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message)
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

  protected onRegisterReservationToLoan(params: ReservationPickupModel): void {
    this.pickupReservationPayload.set(params);
  }

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
