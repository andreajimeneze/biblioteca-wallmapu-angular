import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiResponseModel } from '@core/models/api-response-model';
import { UserStatusService } from '@features/user-status/services/user-status-service';
import { catchError, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-user-status-select-components',
  imports: [
    LoadingComponent, 
    MessageErrorComponent
  ],
  templateUrl: './user-status-select-components.html',
})
export class UserStatusSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  
  private readonly userStatusService = inject(UserStatusService);

  readonly userStatusSignal = toSignal(
    this.userStatusService.getAll().pipe(
      catchError(err => of({
        isSuccess: false,
        statusCode: 500,
        message: err?.message || String(err),
        result: null
      } as ApiResponseModel<null>))
    ),
    { initialValue: undefined }
  );
}
