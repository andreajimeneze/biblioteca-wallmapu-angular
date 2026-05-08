import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { UserService } from '@features/user/services/user-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthStore } from '@features/auth/services/auth-store';
import { catchError, map, of } from 'rxjs';
import { UserProfileComponents } from "@features/user/components/user-profile-components/user-profile-components";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { NotificationListComponents } from "@features/notification/components/notification-list-components/notification-list-components";
import { UserDetailModel } from '@features/user/models/user-model';
import { AuthUser } from '@features/auth/models/auth-user';
import { extractErrorMessage } from '@core/utils/error-handler';

@Component({
  selector: 'app-user-profile.page',
  imports: [
    CommonModule,
    SectionHeaderComponent,
    UserProfileComponents,
    MessageErrorComponent,
    NotificationListComponents
],
  templateUrl: './user-profile.page.html',
})
export class UserProfilePage {
  private readonly authStore = inject(AuthStore);
  readonly authUser = computed<AuthUser | null>(() => this.authStore.user());

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() => this.dataResourceRX.isLoading());

  private readonly userService = inject(UserService);
  readonly userDetailComputed = computed<UserDetailModel | null>(() => this.dataResourceRX.value() ?? null);
  readonly isProfileIncomplete = computed(() => {
    const user = this.dataResourceRX.value();
    if (!user) return false;
  
    return !(user.name && user.lastname && user.address && user.rut && user.phone);
  });

  private readonly dataResourceRX = rxResource({
    params: () => this.authUser(),
    stream: ({ params }) => {
      if (!params) return of(null);
  
      return this.userService.getById(params.id_user).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });
  
  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
  }
}
