import { Component } from '@angular/core';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { AdminStatsComponents } from "@features/stats/components/admin-stats-components/admin-stats-components";
import { LoanPoliciesListComponent } from "@features/loan-policies/components/loan-policies-list-component/loan-policies-list-component";
import { DueLoanListComponent } from "@features/loan/components/due-loan-list-component/due-loan-list-component";

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [
    SectionHeaderComponent,
    AdminStatsComponents,
    LoanPoliciesListComponent,
    DueLoanListComponent,
],
  templateUrl: './admin-dashboard-page.html',
})
export class AdminDashboardPage {

}
