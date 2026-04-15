import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReservationModel } from '@features/reservation/models/reservation-model';

@Component({
  selector: 'app-register-loan-detail-components',
  imports: [
    DatePipe,
  ],
  templateUrl: './register-loan-detail-components.html',
})
export class RegisterLoanDetailComponents {
  readonly reservationModel = input<ReservationModel | null>(null)
}
