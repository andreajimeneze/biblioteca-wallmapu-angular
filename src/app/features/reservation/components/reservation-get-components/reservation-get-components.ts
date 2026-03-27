import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { catchError, map, of, tap } from 'rxjs';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-reservation-get-components',
  imports: [
    DatePipe,
    MessageErrorComponent,
    LoadingComponent
],
  templateUrl: './reservation-get-components.html',
})
export class ReservationGetComponents {
  readonly getReservation = output<ReservationModel | null>();

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() => this.reservationRX.isLoading());
  protected readonly reservationComputed = computed<ReservationModel | null>(() => this.reservationRX.value() ?? null);
  protected readonly formData = signal<number | null>(null);

  protected updateId(value: string, input: HTMLInputElement) {
    const sanitized = this.sanitize(value);
      if (sanitized === null) {
      input.value = this.formData()?.toString() ?? '';
      return;
    }
    this.formData.set(sanitized);
  }
  
  private sanitize(value: string): number | null {
    if (!/^[0-9]*$/.test(value)) return null;
    if (value.length > 10) return null;
    return Number(value);
  }

  private readonly reservationService = inject(ReservationService);
  private readonly reservationPayload = signal<number | null>(null);
  
  private readonly reservationRX = rxResource({
    params: () => this.reservationPayload(),
    stream: ({ params: id }) => {
      if (!id) return of(null);

      return this.reservationService.getById(id).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap((res) => {
          this.getReservation.emit(res);
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    },
  });

  protected onGetReservation(event: Event): void {
    event.preventDefault();

    const data = this.formData();
    const error = this.validateFormOnSubmit(data);
    
    if (error) {
      this.errorMessage.set(error);
      return;
    }

    this.errorMessage.set(null);
    this.reservationPayload.set(data);
  }

  private validateFormOnSubmit(data: number | null): string | null {
    if (data === null) return 'El código es requerido';  
    if (isNaN(data)) return 'Debe ser un número válido';
    if (data.toString().length > 10) return 'El código debe tener entre 5 y 10 dígitos';
    return null;
  }
}
