import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { UserFormComponents } from "@features/user/components/user-form-components/user-form-components";
import { UserService } from '@features/user/services/user-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthStore } from '@features/auth/services/auth-store';
import { map, of } from 'rxjs';
import { UserProfileVM } from '@features/user/models/user-profile.vm';

@Component({
  selector: 'app-user-profile.page',
  imports: [
    CommonModule,
    SectionHeaderComponent,
    UserFormComponents
],
  templateUrl: './user-profile.page.html',
})
export class UserProfilePage {
  ROUTES_CONSTANTS=ROUTES_CONSTANTS

  // SERVICIO USER EXTERNO
  private readonly authStore = inject(AuthStore);
  private readonly authUser = computed(() => ({
    userId: this.authStore.user()?.id_user,
    picture: this.authStore.user()?.picture
  }));

  private readonly userService = inject(UserService);

  private readonly userData = rxResource({
    params: () => this.authUser().userId,
    stream: ({ params: id }) => {
      if (!id) return of(null);
  
      return this.userService.getById(id).pipe(
        map(response => {
          if (!response.isSuccess) {
            throw new Error(response.message);
          }
  
          return response.result; // 👈 devolvemos solo el UserModel
        })
      );
    },
  });

  readonly isLoading = this.userData.isLoading;

  readonly errorMessage = computed(() =>
    this.userData.error()?.message ?? null
  );

  readonly userViewModel = computed<UserProfileVM | null>(() => {
    const user = this.userData.value();
    const auth = this.authUser();
  
    if (!user) return null;
  
    return {
      ...user,
      picture: auth.picture ?? null 
    };
  });
  
}
