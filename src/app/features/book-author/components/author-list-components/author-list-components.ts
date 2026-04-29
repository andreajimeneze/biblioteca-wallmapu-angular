import { Component, effect, input, output, signal } from '@angular/core';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { AuthorModel } from '@features/book-author/models/author-model';
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { ButtonRefreshComponent } from "@shared/components/button-refresh-component/button-refresh-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { DatePipe } from '@angular/common';
import { ButtonDeleteComponent } from "@shared/components/button-delete-component/button-delete-component";
import { ButtonEditComponent } from "@shared/components/button-edit-component/button-edit-component";

@Component({
  selector: 'app-author-list-components',
  imports: [
    DatePipe,
    PaginationComponent,
    ButtonRefreshComponent,
    LoadingComponent,
    ButtonDeleteComponent,
    ButtonEditComponent,
  ],
  templateUrl: './author-list-components.html',
})
export class AuthorListComponents {
  readonly isLoading = input<boolean>(false);
  readonly paginationAuthorList = input<PaginationResponseModel<AuthorModel[]> | null>(null);
  protected readonly onDelete = output<AuthorModel>();
  protected readonly onReload = output<void>();
  protected readonly onPrevPage = output<void>();
  protected readonly onNextPage = output<void>();
  protected readonly onEdit = output<AuthorModel>();

  protected readonly totalPages = signal<number>(1);
  
  protected readonly updateTotalPagesEffect = effect(() => {
    const data = this.paginationAuthorList();
    if (data?.pages) {
      this.totalPages.set(data.pages);
    }
  });
}
