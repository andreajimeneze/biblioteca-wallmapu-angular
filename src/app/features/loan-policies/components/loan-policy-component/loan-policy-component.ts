import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoanPoliciesModel } from '@features/loan-policies/models/loan-policies-model';
import { LoanPoliciesService } from '@features/loan-policies/services/loan-policies-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-loan-policy-component',
  imports: [
    LoadingComponent
  ],
  templateUrl: './loan-policy-component.html',
})
export class LoanPolicyComponent {
  protected readonly errorMessage = signal<string | null>(null);
  
  private readonly loanPoliciesService = inject(LoanPoliciesService);
  protected readonly computedLoanPolicy = computed<LoanPoliciesModel | null>(() => this.getLoanPolicyRX.value() ?? null);
  protected readonly isLoading = computed<boolean>(() => this.getLoanPolicyRX.isLoading());
  
  private readonly getLoanPolicyRX = rxResource({
    stream: () => {    
      return this.loanPoliciesService.getDefault().pipe(
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
  
  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.errorMessage.set(message);
  }
}
