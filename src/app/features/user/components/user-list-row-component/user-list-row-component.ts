import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetailModel } from '@features/user/models/user-detail-model';
import { Role } from '@shared/constants/roles-enum';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-user-list-row-component',
  imports: [
    CommonModule,
    NgOptimizedImage
],
  templateUrl: './user-list-row-component.html',
})
export class UserListRowComponent {
  ROUTES_CONSTANTS=ROUTES_CONSTANTS
  private router = inject(Router);
  
  readonly editRole = input.required<Role>();
  readonly userDetailModel = input<UserDetailModel>();

  protected onEdit(userDetailModel: UserDetailModel): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.USERS.FORM], { 
      state: {
        editRole: this.editRole(),
        userDetailModel: userDetailModel,
        navigateBack: ROUTES_CONSTANTS.PROTECTED.ADMIN.USERS.ROOT,
      } 
    }); 
  }
}
