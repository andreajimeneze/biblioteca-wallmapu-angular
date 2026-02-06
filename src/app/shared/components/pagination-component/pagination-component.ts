import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination-component',
  imports: [],
  templateUrl: './pagination-component.html',
})
export class PaginationComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();

  readonly prevPage = output<void>();
  readonly nextPage = output<void>();

  protected onClickPrev(): void {
    this.prevPage.emit();
  }

  protected onClickNext(): void {
    this.nextPage.emit();
  }
}
