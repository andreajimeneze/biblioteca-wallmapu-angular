import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiResponseModel } from '@core/models/api-response-model';
import { CommuneService } from '@features/commune/services/commune-service';
import { catchError, finalize, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-commune-select-components',
  imports: [
    CommonModule,
    LoadingComponent,
    MessageErrorComponent
],
  templateUrl: './commune-select-components.html',
})
export class CommuneSelectComponents {
  // USO
  //<app-commune-select-components 
  //  [communeId]="myId"
  //  (communeSelected)="onCommuneSelected($event)"
  ///>

  readonly communeSelected = output<number | null>();
  readonly communeId = input<number | null>(null);

  private readonly communeService = inject(CommuneService);
  readonly loading = signal(true);

  private communeSignal = toSignal(
    this.communeService.getAll().pipe(
      catchError((err) => {
        return of({
          isSuccess: false,
          statusCode: 500,
          message: err?.message || String(err),
          result: null
        } as ApiResponseModel<null> );
      }), finalize(() => {
        this.loading.set(false);
      })
    ),
    { initialValue: undefined }
  );

  communeResult = computed(() => this.communeSignal());

  private readonly syncInitialId = effect(() => {
    const id = this.communeId();
    const list = this.communeResult()?.result;
  
    if (id && list?.length) {
      const found = list.find((c) => c.id_commune === id);
      if (found) this.selected.set(found);
    }
  });

  // ─── Estado del combobox ───────────────────────────────
  searchTerm   = signal('');
  isOpen       = signal(false);
  selected     = signal<{ id_commune: number; commune: string } | null>(null);

  filtered = computed(() => {
    const list = this.communeResult()?.result ?? [];
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return list;
    return list.filter((c) => c.commune.toLowerCase().includes(term));
  });

  // ─── Handlers ─────────────────────────────────────────
  onSearch(value: string) {
    this.searchTerm.set(value);
    this.isOpen.set(true);
    if (this.selected() && value !== this.selected()!.commune) {
      this.selected.set(null);
    }
  }

  readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  select(item: { id_commune: number; commune: string }, event: MouseEvent) {
    event.preventDefault();
    this.selected.set(item);
    this.searchTerm.set('');
    this.isOpen.set(false);
    this.inputRef()?.nativeElement.blur(); // 👈 esto dispara el onBlur y cierra la lista
    this.communeSelected.emit(item.id_commune); // 👈
  }

  clear(event: MouseEvent) {
    event.preventDefault();
    this.selected.set(null);
    this.searchTerm.set('');
    this.communeSelected.emit(null); // 👈
  }

  onBlur() {
    setTimeout(() => {
      this.isOpen.set(false);
      if (!this.selected()) this.searchTerm.set('');
    }, 150);
  }

  highlight(text: string): string {
    const term = this.searchTerm().trim();
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(
      regex,
      '<mark class="bg-primary/20 text-primary font-semibold rounded">$1</mark>'
    );
  }
}
