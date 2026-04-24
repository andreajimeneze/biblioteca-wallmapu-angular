import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoanDetailModel } from '@features/loan/models/loan-model';
import { LoanService } from '@features/loan/services/loan-service';
import { ButtonClearComponent } from "@shared/components/button-clear-component/button-clear-component";
import { SearchCodbarComponent } from "@shared/components/search-codbar-component/search-codbar-component";
import { catchError, map, of, tap } from 'rxjs';
import { LoanDetailComponent } from "../loan-detail-component/loan-detail-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-loan-to-return-component',
  imports: [
    ButtonClearComponent,
    SearchCodbarComponent,
    LoanDetailComponent,
    MessageErrorComponent
],
  templateUrl: './loan-to-return-component.html',
})
export class LoanToReturnComponent {
  protected readonly clearCounter = signal<number>(0);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isButtonDisabled = signal<boolean>(false);
  
  protected readonly isLoading = computed<boolean>(() => this.getLoanRX.isLoading());
  
  private readonly loanService = inject(LoanService);
  private readonly getLoanPayload = signal<string | null>(null);
  protected readonly computedLoan = computed<LoanDetailModel | null>(() => this.getLoanRX.value() ?? null);

  private readonly getLoanRX = rxResource({
    params: () => this.getLoanPayload(),
    stream: ({ params: id }) => {
      if (!id) return of(null);
      this.errorMessage.set(null);
      
      return this.loanService.getByCopyBarCode(id).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        tap(() => {
          this.isButtonDisabled.set(true);
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  protected onEnterBookBarCode(barcode: string | null): void {
    this.getLoanPayload.set(barcode);
  }
  
  protected onClear(): void {
    this.getLoanPayload.set(null);
    this.errorMessage.set(null);
    this.clearCounter.update(e => e + 1);
    this.isButtonDisabled.set(false);
  }

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    
    this.errorMessage.set(message);
  }
}
