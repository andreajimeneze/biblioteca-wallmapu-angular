import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthorModel } from '@features/book-author/models/author-model';
import { AuthorService } from '@features/book-author/services/author-service';
import { SelectItem, toSelectItemList } from '@shared/models/select-item.model';
import { SearchableSelectComponent } from '@shared/components/searchable-select/searchable-select.component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-author-select-components',
  standalone: true,
  imports: [SearchableSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './author-select-components.html',
})
export class AuthorSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly onNewSelectedAuthor = output<AuthorModel>();
  readonly clearTrigger = input<number>(0);

  private readonly authorService = inject(AuthorService);

  private readonly authorRX = rxResource({
    stream: () => {
      return this.authorService.getAll().pipe(
        map((res) => {
          if (!res.isSuccess) throw new Error(res.message);
          return res.data;
        }),
        catchError(() => of([])),
      );
    },
  });

  protected readonly isLoading = computed(() => this.authorRX.isLoading());
  protected readonly authorComputedList = computed<AuthorModel[]>(() => this.authorRX.value() ?? []);

  protected readonly authorSelectItems = computed<SelectItem[]>(() => {
    return toSelectItemList(this.authorComputedList());
  });

  protected onSelectionChange(item: SelectItem): void {
    const author = this.authorComputedList().find(a => a.id_author === item.id);
    if (author) {
      this.onNewSelectedAuthor.emit(author);
    }
  }

  protected onCleared(): void {
    this.onNewSelectedAuthor.emit({ id_author: 0, name: '', created_at: '', updated_at: '' } as AuthorModel);
  }
}
