import { Component, input, output } from '@angular/core';
import { LoanPoliciesModel } from '@features/loan-policies/models/loan-policies-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-loan-policies-list-component',
  imports: [
    LoadingComponent
  ],
  templateUrl: './loan-policies-list-component.html',
})
export class LoanPoliciesListComponent {
  readonly isLoading = input<boolean>();
  readonly loanPoliciesList = input<LoanPoliciesModel[]>([]);
  readonly onAdd = output<void>();
  readonly onEdit = output<LoanPoliciesModel>();
  readonly onDelete = output<LoanPoliciesModel>();

  protected add(): void {
    this.onAdd.emit();
  }

  protected edit(item: LoanPoliciesModel): void {
    this.onEdit.emit(item);
  }

  protected delete(item: LoanPoliciesModel): void {
    this.onDelete.emit(item);
  }
}
