import { Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EditorialModel } from '@features/book-editorial/models/editorial-model';
import { EditorialService } from '@features/book-editorial/services/editorial-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-editorial-select-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './editorial-select-components.html',
})
export class EditorialSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  private readonly editorialService = inject(EditorialService);

  private readonly editorialRX = rxResource({
    stream: () => {    
      return this.editorialService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          return of(null);
        }),
      );
    },
  });

  protected readonly isLoading = computed<boolean>(() => this.editorialRX.isLoading());
  protected readonly editorialComputedList = computed<EditorialModel[]>(() => this.editorialRX.value() ?? []);

  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value); 
    this.newSelectedId.emit(newId); 
  }
}
