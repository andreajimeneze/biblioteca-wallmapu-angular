import { Component, input, output } from '@angular/core';
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-reservation-status-select-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './reservation-status-select-components.html',
})
export class ReservationStatusSelectComponents {
  readonly reservationStatusList = input<ReservationStatusModel[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value);
    this.newSelectedId.emit(newId); 
  }
}
