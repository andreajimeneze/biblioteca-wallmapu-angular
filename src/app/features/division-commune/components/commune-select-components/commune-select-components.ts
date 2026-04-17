import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommuneService } from '@features/division-commune/services/commune-service';
import { CommuneModel } from '@features/division-commune/models/commune-model';
import { SelectItem, toSelectItemList } from '@shared/models/select-item.model';
import { SearchableSelectComponent } from '@shared/components/searchable-select/searchable-select.component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-commune-select-components',
  standalone: true,
  imports: [SearchableSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './commune-select-components.html',
})
export class CommuneSelectComponents {
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();

  private readonly communeService = inject(CommuneService);

  private readonly communeRX = rxResource({
    stream: () =>
      this.communeService.getAll().pipe(
        map((res) => {
          if (!res.isSuccess) throw new Error(res.message);
          return res.data;
        }),
        catchError(() => of([])),
      ),
  });

  protected readonly isLoading = computed(() => this.communeRX.isLoading());
  protected readonly communeComputedList = computed<CommuneModel[]>(() => this.communeRX.value() ?? []);

  protected readonly communeSelectItems = computed<SelectItem[]>(() => {
    return toSelectItemList(this.communeComputedList());
  });

  protected onSelectionChange(item: SelectItem): void {
    this.newSelectedId.emit(item.id);
  }

  protected onCleared(): void {
    this.newSelectedId.emit(0);
  }
}
