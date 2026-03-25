import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ReservationModel } from '@features/reservation/models/reservation-model';
import { ReservationCancelBtnComponents } from "../reservation-cancel-btn-components/reservation-cancel-btn-components";
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-reservation-list-components',
  imports: [
    DatePipe,
    ReservationCancelBtnComponents,
    LoadingComponent
],
  templateUrl: './reservation-list-components.html',
})
export class ReservationListComponents {
  private readonly reservationService = inject(ReservationService);
  protected readonly computedReservationList = computed<ReservationModel[]>(() => this.reservationRX.value() ?? []);
  protected readonly isLoading = computed(() => 
    [
      this.reservationRX,
    ].some(e => e.isLoading())
  );

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly reservationRX = rxResource({
    stream: () => {    
      return this.reservationService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });  

  protected onReload(): void {
    console.log("RELOAD")
    this.reservationRX.reload();
  }
}
