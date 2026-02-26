import { Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserStatusService } from '@features/user-status/services/user-status-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { UserStatusModel } from '@features/user-status/models/user-status-model';

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
  readonly newSelectedId = output<number>();
  
  private readonly userStatusService = inject(UserStatusService);

  private readonly userStatusRX = rxResource({
    stream: () => {    
      return this.userStatusService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  protected readonly isLoading = computed(() => this.userStatusRX.isLoading());
  protected readonly errorMessage = computed<string | null>(() => this.userStatusRX.error()?.message ?? null);
  protected readonly userStatusComputedList = computed<UserStatusModel[]>(() => this.userStatusRX.value() ?? []);

  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value); 
    this.newSelectedId.emit(newId); 
  }
}

