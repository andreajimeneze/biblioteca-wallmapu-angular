import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StatModel } from '@features/stats/models/stat-model';
import { StatService } from '@features/stats/services/stat-service';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-stat.page',
  imports: [
  ],
  templateUrl: './stat.page.html',
})
export class StatPage {
  private readonly statService = inject(StatService)

  private readonly statsRX = rxResource({
    stream: () => {    
      return this.statService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  readonly statsComputedList = computed<StatModel | null>(() => {
    const data = this.statsRX.value();
    if (!data) return null;
    return data
  });

}
