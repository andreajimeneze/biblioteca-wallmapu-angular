import { Component, input } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { UserListRowComponent } from "../user-list-row-component/user-list-row-component";
import { UserDetailModel } from '@features/user/models/user-detail-model';

@Component({
  selector: 'app-user-list-components',
  imports: [
    LoadingComponent,
    UserListRowComponent
],
  templateUrl: './user-list-components.html',
})
export class UserListComponents {
  readonly isLoading = input<boolean>(true);
  readonly userDetailList = input<UserDetailModel[]>([]);
}
