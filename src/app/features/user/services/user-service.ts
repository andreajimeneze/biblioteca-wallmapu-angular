import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '@features/user/models/user-model';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/helpers/api-response-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'users';

  getAll(): Observable<ApiResponseModel<UserModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<UserModel[]>>(
      `${this.endpoint}`
    );
  }

  getById(id: string): Observable<ApiResponseModel<UserModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<UserModel | null>>(
      this.endpoint, id
    );
  }

  update(item: UserModel): Observable<ApiResponseModel<UserModel>> {
    return this.apiResponseService.update<ApiResponseModel<UserModel>, UserModel>(
      this.endpoint, item.id_user, item
    );
  }
}
