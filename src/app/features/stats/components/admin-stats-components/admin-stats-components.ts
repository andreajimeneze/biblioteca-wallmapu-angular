import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AdminStatsModel } from '@features/stats/models/stat-model';
import { StatService } from '@features/stats/services/stat-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-stats-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './admin-stats-components.html',
})
export class AdminStatsComponents {  
  private router = inject(Router);
  private readonly statService = inject(StatService);
  protected readonly isLoading = computed(() => this.statRX.isLoading());
  protected readonly computedStats = computed<AdminStatsModel | null>(() => this.statRX.value() ?? null);

  private readonly statRX = rxResource({
    stream: () => {    
      return this.statService.getAdminStats().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  protected onNavigateToReservations(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.RESERVATION.ROOT]);
  }

  protected onNavigateToLoans(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.LOAN.ROOT]);
  }

  protected onNavigateToBooks(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOK.ROOT]);
  }

  protected onNavigateToUsers(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.USERS.ROOT]);
  }

  protected onNavigateToNews(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.NEWS.ROOT]);
  }
}
