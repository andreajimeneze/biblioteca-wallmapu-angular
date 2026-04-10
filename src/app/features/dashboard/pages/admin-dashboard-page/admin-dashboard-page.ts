import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoanPoliciesModel } from '@features/loan-policies/models/loan-policies-model';
import { LoanPoliciesService } from '@features/loan-policies/services/loan-policies-service';
import { LoanService } from '@features/loan/services/loan-service';
import { catchError, map, of, tap } from 'rxjs';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { RegisterLoanComponents } from "@features/dashboard/components/register-loan-components/register-loan-components";
import { RegisterReturnComponents } from "@features/dashboard/components/register-return-components/register-return-components";
import { ReservationListComponents } from "@features/reservation/components/reservation-list-components/reservation-list-components";
import { AdminStatsComponents } from "@features/stats/components/admin-stats-components/admin-stats-components";
import { LoanPoliciesListComponent } from "@features/loan-policies/components/loan-policies-list-component/loan-policies-list-component";
import { DueLoanListComponent } from "@features/loan/components/due-loan-list-component/due-loan-list-component";
import { LoanListComponent } from "@features/loan/components/loan-list-component/loan-list-component";
import { LoanModel } from '@features/loan/models/loan-model';
import { ReservationModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [
    SectionHeaderComponent,
    RegisterLoanComponents,
    RegisterReturnComponents,
    ReservationListComponents,
    AdminStatsComponents,
    LoanPoliciesListComponent,
    DueLoanListComponent,
    LoanListComponent
],
  templateUrl: './admin-dashboard-page.html',
})
export class AdminDashboardPage {
  private readonly loanService = inject(LoanService);
  private readonly loanPoliciesService = inject(LoanPoliciesService);
  protected readonly computedLoanList = computed<LoanModel[]>(() => this.getLoanRX.value() ?? []);
  protected readonly computedLoanPolicies = computed<LoanPoliciesModel[]>(() => this.getLoanPoliciesRX.value() ?? []);
  protected readonly isLoading = computed(() => 
    [
      this.getLoanRX,
      this.getLoanPoliciesRX,
    ].some(e => e.isLoading())
  );

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly getLoanRX = rxResource({
    stream: () => {    
      return this.loanService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly getLoanPoliciesRX = rxResource({
    stream: () => {    
      return this.loanPoliciesService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });
  
  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.successMessage.set(null);
    this.errorMessage.set(message);
  }
}
