import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoanPoliciesModel } from '@features/loan-policies/models/loan-policies-model';
import { LoanPoliciesService } from '@features/loan-policies/services/loan-policies-service';
import { LoanService } from '@features/loan/services/loan-service';
import { catchError, map, of } from 'rxjs';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { AdminStatsComponents } from "@features/dashboard/components/admin-stats-components/admin-stats-components";
import { RegisterLoanComponents } from "@features/dashboard/components/register-loan-components/register-loan-components";
import { RegisterReturnComponents } from "@features/dashboard/components/register-return-components/register-return-components";
import { ReservationListComponents } from "@features/reservation/components/reservation-list-components/reservation-list-components";

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [
    JsonPipe,
    SectionHeaderComponent,
    AdminStatsComponents,
    RegisterLoanComponents,
    RegisterReturnComponents,
    ReservationListComponents
],
  templateUrl: './admin-dashboard-page.html',
})
export class AdminDashboardPage {
  private readonly loanService = inject(LoanService);
  private readonly loanPoliciesService = inject(LoanPoliciesService)
  protected readonly computedLoanList = computed<any>(() => this.loanRX.value() ?? []);
  protected readonly computedLoanPolicies = computed<LoanPoliciesModel | null>(() => this.loanPoliciesRX.value() ?? null);
  protected readonly isLoading = computed(() => 
    [
      this.loanRX,
      this.loanPoliciesRX,
    ].some(e => e.isLoading())
  );

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

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

  private readonly loanPoliciesRX = rxResource({
    stream: () => {    
      return this.loanPoliciesService.getAll().pipe(
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
