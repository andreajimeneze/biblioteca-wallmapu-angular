import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/helpers/api-response-service';
import { ApiResponseModel } from '@core/models/api-response-model';
import { UserRoleModel } from '@features/user-role/models/user-role-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'user-role';

  getAll(): Observable<ApiResponseModel<UserRoleModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<UserRoleModel[]>>(
      `${this.endpoint}`
    );
  }
}
