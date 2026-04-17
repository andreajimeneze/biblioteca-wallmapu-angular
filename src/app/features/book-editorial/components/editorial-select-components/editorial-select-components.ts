import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EditorialModel } from '@features/book-editorial/models/editorial-model';
import { EditorialService } from '@features/book-editorial/services/editorial-service';
import { SelectItem, toSelectItemList } from '@shared/models/select-item.model';
import { SearchableSelectComponent } from '@shared/components/searchable-select/searchable-select.component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-editorial-select-components',
  standalone: true,
  imports: [SearchableSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editorial-select-components.html',
})
export class EditorialSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  readonly clearTrigger = input<number>(0);

  private readonly editorialService = inject(EditorialService);

  private readonly editorialRX = rxResource({
    stream: () => {
      return this.editorialService.getAll().pipe(
        map((res) => {
          if (!res.isSuccess) throw new Error(res.message);
          return res.data;
        }),
        catchError(() => of([])),
      );
    },
  });

  protected readonly isLoading = computed(() => this.editorialRX.isLoading());
  protected readonly editorialComputedList = computed<EditorialModel[]>(() => this.editorialRX.value() ?? []);

  protected readonly editorialSelectItems = computed<SelectItem[]>(() => {
    return toSelectItemList(this.editorialComputedList());
  });

  protected onSelectionChange(item: SelectItem): void {
    this.newSelectedId.emit(item.id);
  }

  protected onCleared(): void {
    this.newSelectedId.emit(0);
  }
}
