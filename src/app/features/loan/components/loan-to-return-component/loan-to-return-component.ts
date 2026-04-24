import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoanDetailModel } from '@features/loan/models/loan-model';
import { LoanService } from '@features/loan/services/loan-service';
import { ButtonClearComponent } from "@shared/components/button-clear-component/button-clear-component";
import { SearchCodbarComponent } from "@shared/components/search-codbar-component/search-codbar-component";
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-loan-to-return-component',
  imports: [
    ButtonClearComponent,
    SearchCodbarComponent
  ],
  templateUrl: './loan-to-return-component.html',
})
export class LoanToReturnComponent {
  protected readonly clearCounter = signal<number>(0);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly enableButton = signal<boolean>(false);
  
  protected readonly isLoading = computed<boolean>(() => this.getLoanRX.isLoading());
  
  private readonly loanService = inject(LoanService);
  private readonly getLoanPayload = signal<number | null>(null);
  protected readonly computedLoan = computed<LoanDetailModel | null>(() => this.getLoanRX.value() ?? null);

  private readonly getLoanRX = rxResource({
    params: () => this.getLoanPayload(),
    stream: ({ params: id }) => {
      if (!id) return of(null);
      this.errorMessage.set(null);
      
      return this.loanService.getById(id).pipe(
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

  protected onEnterBookBarCode(barcode: string | null): void {
    this.errorMessage.set(null);

    const reservation = this.computedLoan();
    if (!reservation) return;

    if (barcode != reservation.copy_barcode) {
      this.errorMessage.set("La Copia NO Coincide con el Prestamo")
      return;
    }

    this.enableButton.set(true);
  }
  
  protected onClear(): void {

  }

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    
    this.successMessage.set(null);
    this.errorMessage.set(message);
  }
}
