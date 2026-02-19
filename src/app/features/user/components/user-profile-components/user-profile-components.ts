import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileVM } from '@features/user/models/user-profile.vm';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-user-profile-components',
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './user-profile-components.html',
})
export class UserProfileComponents {
userViewModel() {
throw new Error('Method not implemented.');
}
  ROUTES_CONSTANTS=ROUTES_CONSTANTS
  private router = inject(Router);
  readonly isLoading = input<boolean>(true);  
  readonly userProfileVM = input<UserProfileVM | null>(null);

  protected onEdit(item: UserProfileVM | null): void {
    if (item) {
      this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.PROFILE.FORM], { state: { userProfileVMurl: item } });
    }
  }
}
