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

  getById(id: number): Observable<ApiResponseModel<ReservationModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<ReservationModel | null>>(
      this.endpoint, id
    );
  }  

  pickup(id: number, copyId: number): Observable<ApiResponseModel<ReservationModel>> {
    return this.apiResponseService.update<ApiResponseModel<ReservationModel>, { copy_id: number }>(
      this.endpoint, `${id}/pickup`, { copy_id: copyId }
    );
  }

  cancel(id: number): Observable<ApiResponseModel<ReservationModel>> {
    return this.apiResponseService.update<ApiResponseModel<ReservationModel>, null>(
      this.endpoint, `${id}/cancel`, null
    );
  }

  expire(): Observable<ApiResponseModel<number>> {
    return this.apiResponseService.update<ApiResponseModel<number>, null>(
      this.endpoint, `expire-overdue`, null
    );
  }
  
  create(item: CreateReservationModel): Observable<ApiResponseModel<any>> {
    return this.apiResponseService.create<ApiResponseModel<any>, CreateReservationModel>(
      this.endpoint, item
    );
  } 
}
