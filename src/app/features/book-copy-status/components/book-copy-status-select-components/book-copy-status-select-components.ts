import { Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BookCopyStatusModel } from '@features/book-copy-status/models/book-copy-status-model';
import { BookCopyStatusService } from '@features/book-copy-status/services/book-copy-status-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-book-copy-status-select-components',
  imports: [LoadingComponent],
  templateUrl: './book-copy-status-select-components.html',
})
export class BookCopyStatusSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  private readonly bookCopyStatusService = inject(BookCopyStatusService);

  private readonly bookCopyStatusRX = rxResource({
    stream: () => {    
      return this.bookCopyStatusService.getAll().pipe(
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

  protected readonly isLoading = computed<boolean>(() => this.bookCopyStatusRX.isLoading());
  protected readonly bookCopyStatusComputedList = computed<BookCopyStatusModel[]>(() => this.bookCopyStatusRX.value() ?? []);

  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value); 
    this.newSelectedId.emit(newId); 
  }
}
