import { Component, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiResponseModel } from '@core/models/api-response-model';
import { UserRoleService } from '@features/user-role/services/user-role-service';
import { catchError, of } from 'rxjs';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-role-select-components',
  imports: [
    CommonModule,
    MessageErrorComponent, 
    LoadingComponent
  ],
  templateUrl: './user-role-select-components.html',
})
export class UserRoleSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  private readonly userRoleService = inject(UserRoleService);

  readonly userRoleSignal = toSignal(
    this.userRoleService.getAll().pipe(
      catchError(err => of({
        isSuccess: false,
        statusCode: 500,
        message: err?.message || String(err),
        result: null
      } as ApiResponseModel<null>))
    ),
    { initialValue: undefined }
  );

  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value); 
    this.newSelectedId.emit(newId); 
  }
}
