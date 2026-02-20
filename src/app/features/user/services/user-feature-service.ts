import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthStore } from '@features/auth/services/auth-store';
import { forkJoin, map, of } from 'rxjs';
import { UserRoleService } from '@features/user-role/services/user-role-service';
import { UserStatusService } from '@features/user-status/services/user-status-service';

@Injectable({
  providedIn: 'root',
})
export class UserFeatureService {
  private readonly userRoleService = inject(UserRoleService);
  private readonly userStatusService = inject(UserStatusService);

  private readonly data = rxResource({
    stream: () => {
      return forkJoin({
        userRoleList: this.userRoleService.getAll(),
        userStatusList: this.userStatusService.getAll(),
      }).pipe(
        map(response => {
          // Validamos cada ApiResponseModel
          if (!response.userRoleList.isSuccess) throw new Error(response.userRoleList.message);
          if (!response.userStatusList.isSuccess) throw new Error(response.userStatusList.message); 

          return response;
        })
      );
    },
  });

  readonly isLoading = this.data.isLoading;

  readonly errorMessage = computed(() => {
    const err = this.data.error();
    if (!err) return null;
    return err instanceof Error ? err.message : String(err);
  });

  readonly userResult   = computed(() => ({
    userRole: this.data.value()?.userRoleList?.result ?? [],
    userStatus: this.data.value()?.userStatusList?.result ?? [],
  }));

  //private readonly data = rxResource({
  //  params: () => this.userId(),
  //  stream: ({ params: id }) => {
  //    if (!id) return of(null);
  //
  //    return forkJoin({
  //      user: this.userService.getById(id),
  //      userRoleList: this.userRoleService.getAll(),
  //      userStatusList: this.userStatusService.getAll(),
  //    }).pipe(
  //      map(response => {
  //        // Validamos cada ApiResponseModel
  //        if (!response.user.isSuccess)  throw new Error(response.user.message);  
  //        if (!response.userRoleList.isSuccess) throw new Error(response.userRoleList.message);
  //        if (!response.userStatusList.isSuccess) throw new Error(response.userStatusList.message); 

  //        return response;
  //      })
  //    );
  //  },
  //}); 
  
  //private readonly data = rxResource({
  //  params: () => this.userId(),
  //  stream: ({ params: id }) => {
  //    if (!id) return of(null);

  //    return forkJoin({
  //      user: this.userService.getById(id),
  //      userRoleList: this.userRoleService.getAll(),
  //      userStatusList: this.userStatusService.getAll(),
  //    });
  //  },
  //});

  //private readonly data = rxResource({
  //  params: () => this.userId(),
  //  stream: ({ params: id }) => {
  //    if (!id) return of(null);
  
  //     return this.userService.getById(id);
  //  },
  //});
 
  //private readonly data = rxResource({
  //  stream: () => this.userService.getAll(),
  //});
}
