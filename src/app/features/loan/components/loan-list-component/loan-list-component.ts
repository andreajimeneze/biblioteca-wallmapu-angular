import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { LoanModel } from '@features/loan/models/loan-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-loan-list-component',
  imports: [
    DatePipe,
    LoadingComponent,
  ],
  templateUrl: './loan-list-component.html',
})
export class LoanListComponent {
  readonly isLoading = input<boolean>();
  readonly loanList = input<LoanModel[]>([]);
  readonly onReload = output<void>();

  protected reload(): void {
    this.onReload.emit();
  }
}
