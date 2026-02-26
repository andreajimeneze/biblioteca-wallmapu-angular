import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '@features/user/models/user-model';
import { ApiResponseModel } from '@core/models/api-response-model';
import { UserUpdateModel } from '@features/user/models/user-update-model';
import { UserDetailModel } from '@features/user/models/user-detail-model';
import { PaginationModel } from '@core/models/pagination-model';
import { ApiResponseService } from '@core/services/api-response-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'users';

  getAllDetails(currentPage: number, maxItems:number, search: string = ""): Observable<ApiResponseModel<PaginationModel<UserDetailModel[]>>> {
    return this.apiResponseService.getAll<ApiResponseModel<PaginationModel<UserDetailModel[]>>>(
      `${this.endpoint}/detailed?page=${currentPage}&items=${maxItems}&search=${search}`
    );
  }

  getById(id: string): Observable<ApiResponseModel<UserDetailModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<UserDetailModel | null>>(
      `${this.endpoint}/detailed`, id
    );
  }

  update_user(id_user: string, item: UserUpdateModel): Observable<ApiResponseModel<UserModel>> {
    return this.apiResponseService.update<ApiResponseModel<UserModel>, UserUpdateModel>(
      this.endpoint, id_user, item
    );
  }

  update_admin(id_user: string, item: UserUpdateModel): Observable<ApiResponseModel<UserModel>> {
    return this.apiResponseService.update<ApiResponseModel<UserModel>, UserUpdateModel>(
      `${this.endpoint}/admin`, id_user, item
    );
  }
}
