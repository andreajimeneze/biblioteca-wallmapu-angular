import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EditionCopyStatusModel } from '@features/edition-copy-status/models/edition-copy-status-model';
import { EditionCopyStatusService } from '@features/edition-copy-status/services/edition-copy-status-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-edition-copy-status-select-components',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingComponent,
  ],
  templateUrl: './edition-copy-status-select-components.html',
})
export class EditionCopyStatusSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  private readonly editionCopyStatusService = inject(EditionCopyStatusService);

  private readonly editionCopyStatusRX = rxResource({
    stream: () => {    
      return this.editionCopyStatusService.getAll().pipe(
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

  protected readonly isLoading = computed<boolean>(() => this.editionCopyStatusRX.isLoading());
  protected readonly editionCopyStatusComputedList = computed<EditionCopyStatusModel[]>(() => this.editionCopyStatusRX.value() ?? []);

  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value); 
    this.newSelectedId.emit(newId); 
  }
}
