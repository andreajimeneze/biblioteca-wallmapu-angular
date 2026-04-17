import { DatePipe, JsonPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ReservationModel } from '@features/reservation/models/reservation-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ReservationStatusSelectComponents } from "@features/reservation-status/components/reservation-status-select-components/reservation-status-select-components";
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { ButtonDeleteComponent } from "@shared/components/button-delete-component/button-delete-component";

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
  readonly selectIdStatus = input<number>(0);
  readonly reservationList = input<ReservationModel[]>([]);
  readonly reservationStatusList = input<ReservationStatusModel[]>([]);
  protected readonly onSelectedIdStatus = output<number>();
  protected readonly onCancelReservation = output<number>();
  protected readonly onUpdateExpireReservation = output<void>();
  protected readonly onReload = output<void>();
}
