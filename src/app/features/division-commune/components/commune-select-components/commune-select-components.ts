import { Component, computed, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { catchError, map, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommuneService } from '@features/division-commune/services/commune-service';
import { CommuneModel } from '@features/division-commune/models/commune-model';

@Component({
  selector: 'app-commune-select-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './commune-select-components.html',
})
export class CommuneSelectComponents {
  // ─── Inputs/Outputs ─────────────────────────────
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();

  // ─── Estado interno ─────────────────────────────
  protected readonly isOpen = signal(false);
  protected readonly searchText = signal('');
  protected readonly selectedAuthor = signal<CommuneModel | null>(null);

  readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // ─── Servicio ───────────────────────────────────
  private readonly communeService = inject(CommuneService);

  private readonly communeRX = rxResource({
    stream: () =>
      this.communeService.getAll().pipe(
        map((res) => {
          if (!res.isSuccess) throw new Error(res.message);
          return res.result;
        }),
        catchError(err => {
          return of(null);
        })
      ),
  });

  protected readonly isLoading = computed(() => this.communeRX.isLoading());
  protected readonly communeComputedList = computed<CommuneModel[]>(() => this.communeRX.value() ?? []);

  // ─── Sincronización inicial ─────────────────────
  private readonly syncInitial = effect(() => {
    const id = this.selectedId();
    const list = this.communeComputedList();
    if (id && list?.length) {
      const found = list.find((a) => a.id_commune === id);
      if (found) this.selectedAuthor.set(found);
    }
  });

  // ─── Computeds ──────────────────────────────────
  protected readonly selectedAuthorName = computed(() => {
    const sel = this.selectedAuthor();
    return sel?.commune ?? null;
  });

  protected readonly filteredAuthors = computed(() => {
    const term = this.searchText().toLowerCase().trim();
    const list = this.communeComputedList();
    if (!term) return list;
    return list.filter((a) => a.commune.toLowerCase().includes(term));
  });

  // ─── Handlers ──────────────────────────────────
  protected onSearch(value: string) {
    this.searchText.set(value);
    this.isOpen.set(true);
    if (this.selectedAuthor() && value !== this.selectedAuthor()!.commune) {
      this.selectedAuthor.set(null);
    }
  }

  protected select(commune: CommuneModel, event: MouseEvent) {
    event.preventDefault();
    this.selectedAuthor.set(commune);
    this.searchText.set('');
    this.isOpen.set(false);
    this.inputRef()?.nativeElement.blur();
    this.newSelectedId.emit(commune.id_commune);
  }

  protected clearSelection(event: MouseEvent) {
    event.preventDefault();
    this.selectedAuthor.set(null);
    this.searchText.set('');
    this.newSelectedId.emit(0);
  }

  protected onBlur() {
    setTimeout(() => {
      this.isOpen.set(false);
      if (!this.selectedAuthor()) this.searchText.set('');
    }, 150);
  }

  protected highlight(text: string): string {
    const term = this.searchText().trim();
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(
      regex,
      '<mark class="bg-primary/20 text-primary font-semibold rounded">$1</mark>'
    );
  }
}
