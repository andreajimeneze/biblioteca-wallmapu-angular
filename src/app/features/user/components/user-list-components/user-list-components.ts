import { Component, input } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { UserListRowComponent } from "../user-list-row-component/user-list-row-component";
import { UserProfileVM } from '@features/user/models/user-profile.vm';

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
  readonly userProfileVMList = input<UserProfileVM[]>([]);
}
