import { Component, input } from '@angular/core';
import { ReservationDetailModel } from '@features/reservation/models/reservation-model';
import { BarcodeGeneratorComponent } from "@shared/components/barcode-generator.component/barcode-generator.component";
import { ReservationDetailComponents } from "../reservation-detail-components/reservation-detail-components";

@Component({
  selector: 'app-reservation-barcode-components',
  imports: [
    BarcodeGeneratorComponent,
    ReservationDetailComponents
],
  templateUrl: './reservation-barcode-components.html',
})
export class ReservationBarcodeComponents {
  readonly reservationDetail = input<ReservationDetailModel | null>(null); 
}