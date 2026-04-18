import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AdminStatsModel } from '@features/stats/models/stat-model';
import { StatService } from '@features/stats/services/stat-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-admin-stats-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './admin-stats-components.html',
})
export class AdminStatsComponents {  
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
}
