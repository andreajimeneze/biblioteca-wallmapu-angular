import { Component, computed, inject } from '@angular/core';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { AdminStatsComponents } from "@features/stats/components/admin-stats-components/admin-stats-components";
import { LoanPoliciesListComponent } from "@features/loan-policies/components/loan-policies-list-component/loan-policies-list-component";
import { ReservationToLoanComponents } from "@features/reservation/components/reservation-to-loan-components/reservation-to-loan-components";
import { LoanToReturnComponent } from "@features/loan/components/loan-to-return-component/loan-to-return-component";
import { LoanOverdueListComponent } from "@features/loan/components/loan-overdue-list-component/loan-overdue-list-component";
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { LoanService } from '@features/loan/services/loan-service';
import { LoanDetailModel } from '@features/loan/models/loan-model';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [
    SectionHeaderComponent,
    AdminStatsComponents,
    LoanPoliciesListComponent,
    ReservationToLoanComponents,
    LoanToReturnComponent,
    LoanOverdueListComponent
],
  templateUrl: './admin-dashboard-page.html',
})
export class AdminDashboardPage {
  protected readonly isLoading = computed<boolean>(() => this.getLoanOverdueRX.isLoading());
  private readonly loanService = inject(LoanService);
  protected readonly computedLoanOverdueList = computed<LoanDetailModel[]>(() => this.getLoanOverdueRX.value() ?? []);

  private readonly getLoanOverdueRX = rxResource({
    stream: () => { 
      return this.loanService.getAllOverdue().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });
}
