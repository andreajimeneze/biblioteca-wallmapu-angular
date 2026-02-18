import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiResponseModel } from '@core/models/api-response-model';
import { UserRoleService } from '@features/user-role/services/user-role-service';
import { catchError, finalize, of } from 'rxjs';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-user-role-select-components',
  imports: [MessageErrorComponent, LoadingComponent],
  templateUrl: './user-role-select-components.html',
})
export class UserRoleSelectComponents {
  private readonly userRoleService = inject(UserRoleService);

  readonly loading = signal(true);

  private userRoleSignal = toSignal(
    this.userRoleService.getAll().pipe(
      catchError((err) => {
        return of({
          isSuccess: false,
          statusCode: 500,
          message: err?.message || String(err),
          result: null
        } as ApiResponseModel<null> );
      }), finalize(() => {
        this.loading.set(false);
      })
    ),
    { initialValue: undefined }
  );

  userRoleResult = computed(() => this.userRoleSignal());
}
