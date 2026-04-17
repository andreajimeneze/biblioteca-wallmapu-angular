import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { SearchCodbarComponent } from "@shared/components/search-codbar-component/search-codbar-component";
import { catchError, map, of, tap } from 'rxjs';
import { RegisterLoanDetailComponents } from "../register-loan-detail-components/register-loan-detail-components";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-register-loan-components',
  imports: [
    SearchCodbarComponent,
    RegisterLoanDetailComponents,
    MessageErrorComponent
],
  templateUrl: './register-loan-components.html',
})
export class RegisterLoanComponents {
  protected readonly clearCounter = signal<number>(0);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly bookErrorMessage = signal<string | null>(null);
  protected readonly reservationErrorMessage = signal<string | null>(null);
  protected readonly enableButton = signal<boolean>(false);
  
  private readonly reservationService = inject(ReservationService);
  private readonly getReservationPayload = signal<number | null>(null);
  private readonly saveReservationPayload = signal<{ id: number; copyId: number } | null>(null);

  protected readonly isLoading = computed<boolean>(() => this.saveReservationRX.isLoading());
  protected readonly isLoadingReservation = computed<boolean>(() => this.getReservationRX.isLoading() || this.saveReservationRX.isLoading());
  protected readonly computedReservation = computed<ReservationModel | null>(() => this.getReservationRX.value() ?? null);
  
  private readonly getReservationRX = rxResource({
    params: () => this.getReservationPayload(),
    stream: ({ params: id }) => {
      if (!id) return of(null);
      this.reservationErrorMessage.set(null);
      this.errorMessage.set(null);
      
      return this.reservationService.getById(id).pipe(
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

  private readonly saveReservationRX = rxResource({
    params: () => this.saveReservationPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);
      this.reservationErrorMessage.set(null);
      this.errorMessage.set(null);
      
      return this.reservationService.pickup(params.id, params.copyId).pipe(
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
  
  protected onSubmitReservation(barcode: string | null): void {
    if (!barcode) return;
    const clean = barcode.trim();
    const isNumeric = /^[0-9]+$/.test(clean);
  
    if (!isNumeric) {
      this.reservationErrorMessage.set("El codigo de barra debe ser numerico");
      return;
    }

    this.getReservationPayload.set(Number(clean));
  }

  protected getBookBarCode(barcode: string | null): void {
    this.bookErrorMessage.set(null);
    const reservation = this.computedReservation();
    if (!reservation) return;

    if (barcode != reservation.copy_barcode) {
      this.bookErrorMessage.set("La Copia NO Coincide con la Reserva")
      return;
    }

    this.enableButton.set(true);
  }

  protected onClick(): void {
    const reservation = this.computedReservation();
    if (reservation && reservation.copy_id) {
      this.saveReservationPayload.set({
        id: reservation.id_reservation,
        copyId: reservation.copy_id
      });
    }
  }

  protected onClear(): void {
    this.getReservationPayload.set(null);
    this.saveReservationPayload.set(null);
    this.bookErrorMessage.set(null);
    this.reservationErrorMessage.set(null);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.clearCounter.update(v => v + 1);
    this.enableButton.set(false);
  }

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.errorMessage.set(message);
  }
}
