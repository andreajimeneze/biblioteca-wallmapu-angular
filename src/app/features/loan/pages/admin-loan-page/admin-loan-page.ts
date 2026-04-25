import { Component, computed, inject, signal } from '@angular/core';
import { LoanListComponent } from "@features/loan/components/loan-list-component/loan-list-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of, tap } from 'rxjs';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { LoanDetailModel, LoanFilterModel } from '@features/loan/models/loan-model';
import { LoanService } from '@features/loan/services/loan-service';
import { LoanPoliciesListComponent } from "@features/loan-policies/components/loan-policies-list-component/loan-policies-list-component";
import { LoanToReturnComponent } from "@features/loan/components/loan-to-return-component/loan-to-return-component";

@Component({
  selector: 'app-admin-loan-page',
  imports: [
    LoanListComponent,
    SectionHeaderComponent,
    MessageSuccessComponent,
    MessageErrorComponent,
    ModalActionComponent,
    LoanPoliciesListComponent,
    LoanToReturnComponent
  ],
  templateUrl: './admin-loan-page.html',
})
export class AdminLoanPage {
  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly selectStatusId = signal<number>(0);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');

  protected readonly isLoading = computed<boolean>(() => 
    [
      this.getLoanRX,
      this.updateExpiredLoanRX,
    ].some(e => e.isLoading())
  );

  private readonly loanService = inject(LoanService);
  private readonly getLoanPayload = computed<PaginationRequestModel<LoanFilterModel>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
      filter: {
        id_status: this.selectStatusId(),
      }
    }
  });
  protected readonly computedPaginationAndLoanList = computed<PaginationResponseModel<LoanDetailModel[]> | null>(() => this.getLoanRX.value() ?? null);

  private readonly getLoanRX = rxResource({
    params: () => this.getLoanPayload(),
    stream: ({ params }) => { 

      return this.loanService.getAllPagination(params).pipe(
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

  private readonly updateExpiredLoanRX = rxResource({
    stream: () => {    
      return this.loanService.expire().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        tap(() => {
          this.onReloadLoan();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  protected closeModal(): void {
    this.isModalOpen.set(false);
  }

  protected onReloadLoan(): void {
    this.getLoanRX.reload();
  }

  protected onUpdateExpireLoan(): void {
    this.updateExpiredLoanRX.reload();
  }
  
  protected onFilterByIdStatus(id: number): void {
    this.selectStatusId.set(id);
  }

  nextPage() {
    const totalPages = this.computedPaginationAndLoanList()?.pages ?? 1

    if (this.currentPage() < totalPages){
      this.currentPage.update(e => e + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.successMessage.set(null);
    this.errorMessage.set(message);
  }
}