import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoanPoliciesModel } from '@features/loan-policies/models/loan-policies-model';
import { LoanPoliciesService } from '@features/loan-policies/services/loan-policies-service';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-loan-policies-list-component',
  imports: [
    LoadingComponent
  ],
  templateUrl: './loan-policies-list-component.html',
})
export class LoanPoliciesListComponent {
  protected readonly errorMessage = signal<string | null>(null);
  
  private readonly loanPoliciesService = inject(LoanPoliciesService);
  protected readonly computedLoanPolicies = computed<LoanPoliciesModel[]>(() => this.getLoanPoliciesRX.value() ?? []);
  protected readonly isLoading = computed<boolean>(() => this.getLoanPoliciesRX.isLoading());
  
  private readonly getLoanPoliciesRX = rxResource({
    stream: () => {    
      return this.loanPoliciesService.getAll().pipe(
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
