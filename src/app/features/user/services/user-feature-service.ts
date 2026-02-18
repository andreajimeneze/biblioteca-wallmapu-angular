import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthStore } from '@features/auth/services/auth-store';
import { UserService } from '@features/user/services/user-service';
import { forkJoin, of } from 'rxjs';
import { UserRoleService } from '@features/user-role/services/user-role-service';
import { UserStatusService } from '@features/user-status/services/user-status-service';

@Injectable({
  providedIn: 'root',
})
export class UserFeatureService {
  private readonly authStore = inject(AuthStore);
  private readonly userService = inject(UserService);
  private readonly userRoleService = inject(UserRoleService);
  private readonly userStatusService = inject(UserStatusService);

  private readonly userId = computed(() => this.authStore.user()?.id_user);

  private readonly data = rxResource({
    params: () => this.userId(),
    stream: ({ params: id }) => {
      if (!id) return of(null);

      return forkJoin({
        user: this.userService.getById(id),
        userRoleList: this.userRoleService.getAll(),
        userStatusList: this.userStatusService.getAll(),
      });
    },
  });

  readonly isLoading = this.data.isLoading;

  readonly errorMessage = computed(() => {
    const err = this.data.error();
    if (!err) return null;
    return err instanceof Error ? err.message : String(err);
  });

  readonly userResult   = computed(() => ({
    authUser: this.authStore.user(),
    user: this.data.value()?.user?.result       ?? null,
    userRole: this.data.value()?.userRoleList?.result   ?? [],
    userStatus: this.data.value()?.userStatusList?.result ?? [],
  }));
}
