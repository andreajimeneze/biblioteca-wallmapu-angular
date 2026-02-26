import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { Observable } from 'rxjs';
import { UserStatusModel } from '@features/user-status/models/user-status-model';
import { ApiResponseService } from '@core/services/api-response-service';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'user-status';

  getAll(): Observable<ApiResponseModel<UserStatusModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<UserStatusModel[]>>(
      `${this.endpoint}`
    );
  }
}
