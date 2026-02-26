import { Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RegionModel } from '@features/division-region/models/region-model';
import { RegionService } from '@features/division-region/services/region-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-region-select-components',
  imports: [LoadingComponent, MessageErrorComponent],
  templateUrl: './region-select-components.html',
})
export class RegionSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  private readonly regionService = inject(RegionService);

  private readonly regionRX = rxResource({
    stream: () => {    
      return this.regionService.getAll().pipe(
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

  protected readonly isLoading = computed<boolean>(() => this.regionRX.isLoading());
  protected readonly errorMessage = computed<string | null>(() => this.regionRX.error()?.message ?? null);
  protected readonly regionComputedList = computed<RegionModel[]>(() => this.regionRX.value() ?? []);

  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value); 
    this.newSelectedId.emit(newId); 
  }
}
