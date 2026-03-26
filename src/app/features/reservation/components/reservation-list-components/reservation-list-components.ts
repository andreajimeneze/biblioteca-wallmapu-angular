import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReservationModel } from '@features/reservation/models/reservation-model';
import { ReservationCancelBtnComponents } from "../reservation-cancel-btn-components/reservation-cancel-btn-components";
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { catchError, map, of, tap } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ReservationStatusSelectComponents } from "@features/reservation-status/components/reservation-status-select-components/reservation-status-select-components";

@Component({
  selector: 'app-reservation-list-components',
  imports: [
    DatePipe,
    ReservationCancelBtnComponents,
    LoadingComponent,
    ReservationStatusSelectComponents
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

  private readonly updateEffect = effect(() => {
    const data = this.computedReservationList();

    if (data.length > 0)
      this.filteredReservationList.set(data);
  });

  protected readonly idReservationStatus = signal<number>(0);
  protected readonly filteredReservationList = signal<ReservationModel[]>([]);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly reservationRX = rxResource({
    stream: () => {    
      return this.reservationService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap((res) => {
          this.onFilterReservation(0);
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });  

  protected onReload(): void {
    this.idReservationStatus.set(0);
    this.reservationRX.reload();
  }

  protected onFilterReservation(id: number): void {
    this.idReservationStatus.set(id);

    if (!id) {
      this.filteredReservationList.set(this.computedReservationList());
      return;
    };

    const filtered = this.computedReservationList().filter(e => e.reservation_status_id == id);
    this.filteredReservationList.set(filtered);
  }
}
