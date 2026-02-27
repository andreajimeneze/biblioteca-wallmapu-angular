import { Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { SubjectService } from '@features/book-subject/services/subject-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-subject-select-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './subject-select-components.html',
})
export class SubjectSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  private readonly subjectService = inject(SubjectService);

  private readonly subjectlRX = rxResource({
    stream: () => {    
      return this.subjectService.getAll().pipe(
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

  protected readonly isLoading = computed<boolean>(() => this.subjectlRX.isLoading());
  protected readonly subjectComputedList = computed<SubjectModel[]>(() => this.subjectlRX.value() ?? []);

  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value); 
    this.newSelectedId.emit(newId); 
  }
}
