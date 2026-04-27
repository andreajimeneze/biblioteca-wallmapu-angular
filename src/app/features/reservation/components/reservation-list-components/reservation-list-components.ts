import { DatePipe } from '@angular/common';
import { Component, input, output, signal, effect } from '@angular/core';
import { ReservationModel } from '@features/reservation/models/reservation-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ReservationStatusSelectComponents } from "@features/reservation-status/components/reservation-status-select-components/reservation-status-select-components";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { ButtonDeleteComponent } from "@shared/components/button-delete-component/button-delete-component";
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ButtonRefreshComponent } from "@shared/components/button-refresh-component/button-refresh-component";

@Component({
  selector: 'app-reservation-list-components',
  imports: [
    DatePipe,
    LoadingComponent,
    ReservationStatusSelectComponents,
    PaginationComponent,
    ButtonDeleteComponent,
    ButtonRefreshComponent
  ],
  templateUrl: './reservation-list-components.html',
})
export class ReservationListComponents {
  readonly isLoading = input<boolean>(false);
  readonly selectStatusId = input<number>(0);
  readonly paginationAndReservationList = input<PaginationResponseModel<ReservationModel[]> | null>(null);
  protected readonly onSelectedReservation = output<ReservationModel>();
  protected readonly onSelectedIdStatus = output<number>();
  protected readonly onCancelReservation = output<number>();
  protected readonly onReload = output<void>();
  protected readonly onNextPage = output<void>();
  protected readonly onPrevPage = output<void>();

  protected readonly totalPages = signal<number>(1);

  protected readonly updateTotalPagesEffect = effect(() => {
    const data = this.paginationAndReservationList();
    if (data?.pages) {
      this.totalPages.set(data.pages);
    }
  });

  protected selectReservation(item: ReservationModel): void {
    this.onSelectedReservation.emit(item);
  }
}
