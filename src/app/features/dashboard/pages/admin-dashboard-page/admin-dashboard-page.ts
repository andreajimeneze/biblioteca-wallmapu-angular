import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoanService } from '@features/loan/services/loan-service';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [
    JsonPipe,
  ],
  templateUrl: './admin-dashboard-page.html',
})
export class AdminDashboardPage {
  private readonly loanService = inject(LoanService);

  protected readonly isLoading = computed(() => this.loanRX.isLoading());
  protected readonly computedLoanList = computed<any>(() => this.loanRX.value() ?? []);

  private readonly loanRX = rxResource({
    stream: () => {    
      return this.loanService.getAll().pipe(
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

}
