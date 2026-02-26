import { Component, input, output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-section-header-component',
  imports: [],
  templateUrl: './section-header-component.html',
})
export class SectionHeaderComponent {
  // INPUTS
  readonly title = input.required<string>();
  readonly description = input<string>('');

  // ACTION BUTON OPTIONAL
  readonly actionText = input<string | null>(null);
  
  readonly actionClicked = output<void>();
  protected onActionClick() {
    this.actionClicked.emit();
  }

  // SEARCH
  readonly searchPlaceholder = input<string | null>(); // Texto del placeholder
  readonly searchChange = output<string>();

  private searchSubject = new Subject<string>();
  constructor() {
    // Emitir solo después de 300ms sin cambios
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchChange.emit(value);
    });
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);  // ← Enviar al subject en lugar de emit directo
  }
}
