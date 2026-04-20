import { DatePipe } from '@angular/common';
import { Component, input, output, signal, effect } from '@angular/core';
import { ReservationModel } from '@features/reservation/models/reservation-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ReservationStatusSelectComponents } from "@features/reservation-status/components/reservation-status-select-components/reservation-status-select-components";
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { ButtonDeleteComponent } from "@shared/components/button-delete-component/button-delete-component";
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Component({
  selector: 'app-reservation-list-components',
  imports: [
    DatePipe,
    LoadingComponent,
    ReservationStatusSelectComponents,
    PaginationComponent,
    ButtonDeleteComponent
  ],
  templateUrl: './reservation-list-components.html',
})
export class ReservationListComponents {
  readonly isLoading = input<boolean>(false);
  readonly selectStatusId = input<number>(0);
  readonly paginationAndReservationList = input<PaginationResponseModel<ReservationModel[]> | null>(null);
  protected readonly onSelectedIdStatus = output<number>();
  protected readonly onCancelReservation = output<number>();
  protected readonly onReload = output<void>();
  protected readonly onNextPage = output<void>();
  protected readonly onPrevPage = output<void>();

  protected readonly totalPages = signal<number>(0);

  protected readonly updateTotalPagesEffect = effect(() => {
    const data = this.paginationAndReservationList();
    if (data?.pages) {
      this.totalPages.set(data.pages);
    }
  });
}
