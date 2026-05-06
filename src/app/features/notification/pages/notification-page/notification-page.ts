import { Component, computed, inject, signal } from '@angular/core';
import { NotificationListComponents } from "@features/notification/components/notification-list-components/notification-list-components";
import { NotificationFormComponents } from "@features/notification/components/notification-form-components/notification-form-components";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { NotificationDetailModel } from '@features/notification/models/notification-model';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { NotificationService } from '@features/notification/services/notification-service';

@Component({
  selector: 'app-notification-page',
  imports: [
    NotificationListComponents, 
    NotificationFormComponents, 
    MessageSuccessComponent, 
    MessageErrorComponent
  ],
  templateUrl: './notification-page.html',
})
export class NotificationPage {
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');
  
  protected readonly isLoading = computed<boolean>(() => this.getNotificationRX.isLoading())

  private readonly notificationService = inject(NotificationService);
  private readonly getNotificationPayload = computed<PaginationRequestModel<null>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
      filter: null
    }
  });
  protected readonly computedPaginationAndNotificationList = computed<PaginationResponseModel<NotificationDetailModel[]> | null>(() => this.getNotificationRX.value() ?? null);
  
  private readonly getNotificationRX = rxResource({
    params: () => this.getNotificationPayload(),
    stream: ({ params }) => { 

      return this.notificationService.getAllPagination(params).pipe(
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

  protected onReloadNotification(): void {
    this.getNotificationRX.reload();
  }


  protected nextPage(): void {
    const totalPages = this.computedPaginationAndNotificationList()?.pages ?? 1

    if (this.currentPage() < totalPages){
      this.currentPage.update(e => e + 1);
    }
  }

  protected prevPage(): void {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.errorMessage.set(message);
    this.successMessage.set(null);
  }
}
