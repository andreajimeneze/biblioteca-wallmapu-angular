import { Component } from '@angular/core';
import { ReservationGetComponents } from "@features/reservation/components/reservation-get-components/reservation-get-components";
import { ReservationModel } from '@features/reservation/models/reservation-model';

@Component({
  selector: 'app-register-loan-components',
  imports: [
    ReservationGetComponents,
  ],
  templateUrl: './register-loan-components.html',
})
export class RegisterLoanComponents {
  protected onGetReservation(item: ReservationModel | null): void {
    console.log(item)
  }
}
