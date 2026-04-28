import { Component, effect, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthorModel } from '@features/book-author/models/author-model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { GenreSelectComponents } from "@features/book-genre/components/genre-select-components/genre-select-components";
import { EditorialSelectComponents } from "@features/book-editorial/components/editorial-select-components/editorial-select-components";
import { AuthorSelectComponents } from "@features/book-author/components/author-select-components/author-select-components";

@Component({
  selector: 'app-edition-search-component',
  imports: [GenreSelectComponents, EditorialSelectComponents, AuthorSelectComponents],
  templateUrl: './edition-search-component.html',
})
export class EditionSearchComponent {
  readonly textTitle = input<string | null>(null);
  readonly textDescription = input<string | null>(null);
  readonly textBtn = input<string | null>(null);
  readonly searchPlaceholder = input<string | null>(null);
  readonly onSearchChange = output<string>();
  readonly onBtnSearchClick = output<void>();
  readonly onAuthorIdSelected = output<number>();
  readonly onEditorialIdSelected = output<number>();
  readonly onGenreIdSelected = output<number>();

  protected btnClick() {
    this.onBtnSearchClick.emit();
  }

  protected searchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue.set(value);
    this.clearSearch.set(value);
  }

  private readonly searchValue = signal('');

  private readonly emitSearch = effect(() => {
    const value = this.searchDebounced();
    if (value) {
      this.onSearchChange.emit(value);
    }
  });

  private readonly searchDebounced = toSignal(
    toObservable(this.searchValue).pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  protected readonly clearSearch = signal<string>('');
  protected readonly clearAuthorTrigger = signal<number>(0);
  protected readonly clearEditorialTrigger = signal<number>(0);
  protected readonly clearGenreTrigger = signal<number>(0);

  protected onClear(): void {
    this.clearAuthorTrigger.update(v => v + 1);
    this.clearEditorialTrigger.update(v => v + 1);
    this.clearGenreTrigger.update(v => v + 1);
    this.onAuthorIdSelected.emit(0);
    this.clearSearch.set('');
    this.onSearchChange.emit('');
  }

  protected authorSelected(item: AuthorModel | null) {
    if (!item) return;
    if (!item.id_author || item.id_author === 0) return;

    this.onAuthorIdSelected.emit(item.id_author)
  }

  protected editorialSelected(id: number) {
    this.onEditorialIdSelected.emit(id)
  }

  protected genreSelected(id: number) {
    this.onGenreIdSelected.emit(id)
  }
}
