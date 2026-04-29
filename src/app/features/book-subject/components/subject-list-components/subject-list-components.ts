import { Component, effect, input, output, signal } from '@angular/core';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { ButtonRefreshComponent } from "@shared/components/button-refresh-component/button-refresh-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { DatePipe } from '@angular/common';
import { ButtonDeleteComponent } from "@shared/components/button-delete-component/button-delete-component";
import { ButtonEditComponent } from "@shared/components/button-edit-component/button-edit-component";
import { SearchInputComponent } from "@shared/components/search-input-component/search-input-component";

@Component({
  selector: 'app-subject-list-components',
  imports: [
    DatePipe,
    PaginationComponent,
    ButtonRefreshComponent,
    LoadingComponent,
    ButtonDeleteComponent,
    ButtonEditComponent,
    SearchInputComponent
],
  templateUrl: './subject-list-components.html',
})
export class SubjectListComponents {
  readonly isLoading = input<boolean>(false);
  readonly paginationSubjectList = input<PaginationResponseModel<SubjectModel[]> | null>(null);
  protected readonly onDelete = output<SubjectModel>();
  protected readonly onReload = output<void>();
  protected readonly onPrevPage = output<void>();
  protected readonly onNextPage = output<void>();
  protected readonly onEdit = output<SubjectModel>();
  protected readonly onSearch = output<string>();

  protected readonly totalPages = signal<number>(1);
  
  protected readonly updateTotalPagesEffect = effect(() => {
    const data = this.paginationSubjectList();
    if (data?.pages) {
      this.totalPages.set(data.pages);
    }
  });
}
