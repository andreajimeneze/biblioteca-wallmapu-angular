import { Component, computed, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { SearchCodbarComponent } from "@shared/components/search-codbar-component/search-codbar-component";
import { catchError, map, of } from 'rxjs';
import { ReservationDetailComponents } from "../reservation-detail-components/reservation-detail-components";
import { ReservationModel, ReservationPickupModel } from '@features/reservation/models/reservation-model';
import { ButtonClearComponent } from "@shared/components/button-clear-component/button-clear-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-reservation-to-loan-components',
  imports: [
    SearchCodbarComponent,
    ReservationDetailComponents,
    ButtonClearComponent,
    MessageErrorComponent
  ],
  templateUrl: './reservation-to-loan-components.html',
})
export class ReservationToLoanComponents {
  readonly onRegisterReservationToLoan = output<ReservationPickupModel>();

  protected readonly clearCounter = signal<number>(0);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly enableButton = signal<boolean>(false);
  
  private readonly reservationService = inject(ReservationService);
  private readonly getReservationPayload = signal<number | null>(null);
  protected readonly computedReservation = computed<ReservationModel | null>(() => this.getReservationRX.value() ?? null);
  
  protected readonly isLoading = computed<boolean>(() => this.getReservationRX.isLoading());
  
  private readonly getReservationRX = rxResource({
    params: () => this.getReservationPayload(),
    stream: ({ params: id }) => {
      if (!id) return of(null);
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

  protected onSearchReservation(barcode: string | null): void {
    if (!barcode) return;
    const clean = barcode.trim();
    const isNumeric = /^[0-9]+$/.test(clean);
  
    if (!isNumeric) {
      this.errorMessage.set("El codigo de barra debe ser numerico");
      return;
    }

    this.getReservationPayload.set(Number(clean));
  }

  protected onEnterBookBarCode(barcode: string | null): void {
    this.errorMessage.set(null);

    const reservation = this.computedReservation();
    if (!reservation) return;

    if (barcode != reservation.copy_barcode) {
      this.errorMessage.set("La Copia NO Coincide con la Reserva")
      return;
    }

    this.enableButton.set(true);
  }

  protected onReservationToLoan(): void {
    const reservation = this.computedReservation();
    
    if (!reservation || !reservation.id_reservation || !reservation.copy_id) {
      this.errorMessage.set("Seleccione una reserva válida");
      return;
    }

    const payload: ReservationPickupModel = {
      id_reservation: reservation.id_reservation,
      id_copy: reservation.copy_id
    };

    this.onRegisterReservationToLoan.emit(payload);
    this.onClear();
  }

  protected onClear(): void {
    this.clearCounter.update(v => v + 1);
    this.getReservationPayload.set(null);
    this.enableButton.set(false);
  }

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.errorMessage.set(message);
  }
}
