import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { CreateReservationModel, ReservationModel } from '@features/reservation/models/reservation-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'reservations';

  getAll(): Observable<ApiResponseModel<ReservationModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<ReservationModel[]>>(
      `${this.endpoint}`
    );
  }

  cancel(id: number): Observable<ApiResponseModel<ReservationModel>> {
    return this.apiResponseService.update<ApiResponseModel<ReservationModel>, null>(
      this.endpoint, `${id}/cancel`, null
    );
  }
  
  create(item: CreateReservationModel): Observable<ApiResponseModel<any>> {
    return this.apiResponseService.create<ApiResponseModel<any>, CreateReservationModel>(
      this.endpoint, item
    );
  } 
}
