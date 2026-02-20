import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileVM } from '@features/user/models/user-profile.vm';
import { Role } from '@shared/constants/roles-enum';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-user-profile-components',
  imports: [
    CommonModule,
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
  readonly userProfileVM = input<UserProfileVM | null>(null);

  protected onEdit(item: UserProfileVM | null): void {
    if (item) {
      const isAdmin = item.role === Role.Admin;

      const formRoute = isAdmin
      ? ROUTES_CONSTANTS.PROTECTED.ADMIN.PROFILE.FORM
      : ROUTES_CONSTANTS.PROTECTED.USER.PROFILE.FORM;

      const backRoute = isAdmin
      ? ROUTES_CONSTANTS.PROTECTED.ADMIN.PROFILE.ROOT
      : ROUTES_CONSTANTS.PROTECTED.USER.PROFILE.ROOT;

      this.router.navigate([formRoute], {
        state: {
          userProfileVM: item,
          navigateBack: backRoute,
        },
      });
    }
  }
}
