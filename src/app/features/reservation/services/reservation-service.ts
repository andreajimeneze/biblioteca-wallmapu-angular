import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { CreateReservationModel } from '@features/reservation/models/reservation-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'reservations';

  create(item: CreateReservationModel): Observable<ApiResponseModel<any>> {
    return this.apiResponseService.create<ApiResponseModel<any>, CreateReservationModel>(
      this.endpoint, item
    );
  } 
}
