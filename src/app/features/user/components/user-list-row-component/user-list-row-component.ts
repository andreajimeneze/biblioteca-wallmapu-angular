import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileVM } from '@features/user/models/user-profile.vm';
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
  
  readonly userProfileVM = input<UserProfileVM>();

  protected onEdit(item: UserProfileVM): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.USERS.FORM], { 
      state: { 
        userProfileVM: item, 
        navigateBack: ROUTES_CONSTANTS.PROTECTED.ADMIN.USERS.ROOT,
      } 
    }); 
  }
}
