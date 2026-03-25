import { Component, input } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-admin-stats-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './admin-stats-components.html',
})
export class AdminStatsComponents {
  readonly isLoading = input<boolean>(false);
  readonly totalBooks = input<number>(0);
  readonly totalLoans = input<number>(0);
  readonly totalReservations = input<number>(0);
  readonly totalUsers = input<number>(0);
}
