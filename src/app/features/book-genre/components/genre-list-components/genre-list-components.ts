import { Component, effect, input, output, signal } from '@angular/core';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { GenreModel } from '@features/book-genre/models/genre-model';
import { SearchInputComponent } from "@shared/components/search-input-component/search-input-component";
import { ButtonRefreshComponent } from "@shared/components/button-refresh-component/button-refresh-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ButtonDeleteComponent } from "@shared/components/button-delete-component/button-delete-component";
import { ButtonEditComponent } from "@shared/components/button-edit-component/button-edit-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-genre-list-components',
  imports: [
    DatePipe,
    SearchInputComponent, 
    ButtonRefreshComponent, 
    LoadingComponent, 
    ButtonDeleteComponent, 
    ButtonEditComponent, 
    PaginationComponent,
  ],
  templateUrl: './genre-list-components.html',
})
export class GenreListComponents {
  readonly isLoading = input<boolean>(false);
  readonly paginationGenreList = input<PaginationResponseModel<GenreModel[]> | null>(null);
  protected readonly onDelete = output<GenreModel>();
  protected readonly onReload = output<void>();
  protected readonly onPrevPage = output<void>();
  protected readonly onNextPage = output<void>();
  protected readonly onEdit = output<GenreModel>();
  protected readonly onSearch = output<string>();

  protected readonly totalPages = signal<number>(1);
  
  protected readonly updateTotalPagesEffect = effect(() => {
    const data = this.paginationGenreList();
    if (data?.pages) {
      this.totalPages.set(data.pages);
    }
  });
}
