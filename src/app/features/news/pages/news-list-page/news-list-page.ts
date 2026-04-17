import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { NewsService } from '@features/news/services/news-service';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { catchError, map, of, tap } from 'rxjs';
import { NewsListComponent } from "@features/news/components/news-list-component/news-list-component";
import { ModalDeleteComponent } from "@shared/components/modal-delete-component/modal-delete-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { NewsGalleryService } from '@features/news-gallery/services/news-gallery-service';

@Component({
  selector: 'app-news-list-page',
  imports: [
    NewsListComponent,
    ModalDeleteComponent,
    SectionHeaderComponent,
    PaginationComponent,
    MessageErrorComponent
],
  templateUrl: './news-list-page.html',
})
export class NewsListPage {
  private router = inject(Router);
  private readonly newsService = inject(NewsService)
  private readonly newsGalleryService = inject(NewsGalleryService)

  // ─── ESTADOS
  readonly selectedNewsWithImagesModel = signal<NewsWithImagesModel | null>(null);
  readonly openDeleteModal = signal(false);
  readonly currentPage = signal(1);
  private readonly items = signal(10);
  private readonly search = signal('');
  readonly totalPages = signal<number>(0);
  private readonly refreshTrigger = signal(0);
  readonly isLoading = computed(() => 
    this.dataResourceRX.isLoading() || this.deleteRX.isLoading() || this.deleteAllGalleryRX.isLoading()
  );
  readonly errorMessage = computed(() => {
    if (this.dataResourceRX.error()?.message) return this.dataResourceRX.error()!.message;
    if (this.deleteRX.error()?.message) return this.deleteRX.error()!.message;
    if (this.deleteAllGalleryRX.error()?.message) return this.deleteAllGalleryRX.error()!.message;
    return null;
  });

  // ─── GET RX
  private readonly params = computed<PaginationRequestModel>(() => ({
    page: this.currentPage(),
    limit: this.items(),
    search: this.search(),
  }));  
  
  private readonly dataResourceRX = rxResource({
    params: () => this.params(),
    stream: ({ params }) => {    
      return this.newsService.getAll(params).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.totalPages.set(response.data.pages);
          return response.data.data;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  readonly newsWithImagesList = computed<NewsWithImagesModel[] | []>(() => {
    const data = this.dataResourceRX.value();
    if (!data) return [];
    return data
  });

  // DELETE ALL GALLERY IMAGES BY ID NEWS
  private readonly deleteAllGalleryByIdNewsPayload = signal<number | null>(null);

  private readonly deleteAllGalleryRX = rxResource({
    params: () => this.deleteAllGalleryByIdNewsPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.newsGalleryService.delete_all(params).pipe(
        map(r => {
          if (!r.isSuccess) throw new Error(r.message);
          return r.data;
        }),
        tap(() => {
          this.deleteNewsByIdPayload.set(this.deleteAllGalleryByIdNewsPayload());
          this.deleteAllGalleryByIdNewsPayload.set(null);
        }),
        catchError(err => {
          return of(null);
        })
      );
    }
  });
  
  // ─── DELETE NEWS
  private readonly deleteNewsByIdPayload = signal<number | null>(null);

  private readonly deleteRX = rxResource({
    params: () => this.deleteNewsByIdPayload(),
    stream: ({ params: payloadId }) => {
      if (payloadId === null) return of(null);

      return this.newsService.delete(payloadId).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        tap(() => {
          this.refreshList()
          this.closeDeleteModal();
          this.deleteNewsByIdPayload.set(null);
          this.selectedNewsWithImagesModel.set(null);
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });
 
  // ─── ACCIONES 
  refreshList() {
    this.refreshTrigger.update(v => v + 1);
  }

  onCreate(){
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.NEWS.FORM]);
  }

  onEdit(newsWithImagesModel: NewsWithImagesModel){
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.NEWS.FORM], 
      { state : { newsWithImagesModel: newsWithImagesModel } }
    );
  }

  onDelete(newsWithImagesModel: NewsWithImagesModel) {
    if (!newsWithImagesModel) return;
    this.selectedNewsWithImagesModel.set(newsWithImagesModel)
    this.openDeleteModal.set(true);
  }

  confirmDelete() {
    const selectedNewsWithImagesModel = this.selectedNewsWithImagesModel();
    if (!selectedNewsWithImagesModel) return;
    this.deleteAllGalleryByIdNewsPayload.set(selectedNewsWithImagesModel.id_news);
  } 

  // ─── MODAL
  closeDeleteModal() {
    this.openDeleteModal.set(false);
  }

  // ─── PAGINACION  
  searchText(text: string) {
    this.search.set(text);
    this.currentPage.set(1); 
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()){
      this.currentPage.update(e => e + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }
}
