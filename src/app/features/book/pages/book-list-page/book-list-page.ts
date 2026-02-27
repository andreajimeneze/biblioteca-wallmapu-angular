import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BookModel } from '@features/book/models/book-model';
import { BookService } from '@features/book/services/book-service';
import { catchError, map, of } from 'rxjs';
import { BookListComponent } from "@features/book/components/book-list-component/book-list-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { ModalDeleteComponent } from "@shared/components/modal-delete-component/modal-delete-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";

@Component({
  selector: 'app-book-list-page',
  imports: [
    BookListComponent,
    SectionHeaderComponent,
    MessageErrorComponent,
    //ModalDeleteComponent,
    //PaginationComponent
],
  templateUrl: './book-list-page.html',
})
export class BookListPage {
  private router = inject(Router);
  private readonly bookService = inject(BookService);

  readonly currentPage = signal(1);
  private readonly items = signal(10);
  private readonly search = signal('');
  readonly totalPages = signal<number>(0);
  private readonly refreshTrigger = signal(0);
  
  private readonly params = computed(() => ({
    currentPage: this.currentPage(),
    items: this.items(),
    search: this.search(),
    refresh: this.refreshTrigger(),
  }));  
    
  private readonly bookRX = rxResource({
    params: () => this.params(),
    stream: ({ params }) => {    
      return this.bookService.getAll(
        params.currentPage, 
        params.items, 
        params.search
      ).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.totalPages.set(response.result.pages);
          return response.result.result;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  protected readonly isLoading = computed(() => this.bookRX.isLoading());
  protected readonly errorMessage = computed(() => this.bookRX.error()?.message ?? null);
  protected readonly bookComputedList = computed<BookModel[]>(() => this.bookRX.value() ?? []);

  // ─── ACCIONES 
  refreshList() {
    //this.refreshTrigger.update(v => v + 1);
  }

  onCreate(){
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOKS.FORM]);
  }
  
  onEdit(newsWithImagesModel: BookModel){
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOKS.FORM], 
      { state : { newsWithImagesModel: newsWithImagesModel } }
    );
  }

  onDelete(newsWithImagesModel: BookModel) {
    if (!newsWithImagesModel) return;
    //this.selectedNewsWithImagesModel.set(newsWithImagesModel)
    //this.openDeleteModal.set(true);
  }

   // ─── PAGINACION  
   searchText(text: string) {
    //this.search.set(text);
    //this.currentPage.set(1); 
  }

  
}
