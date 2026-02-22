import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { NewsService } from '@features/news/services/news-service';
import { map } from 'rxjs';
import { NewsListComponent } from "@features/news/components/news-list-component/news-list-component";
import { ModalDeleteComponent } from "@shared/components/modal-delete-component/modal-delete-component";
import { NewsModel } from '@features/news/models/news-model';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";

@Component({
  selector: 'app-news-list-page',
  imports: [
    NewsListComponent,
    ModalDeleteComponent,
    SectionHeaderComponent,
    PaginationComponent
],
  templateUrl: './news-list-page.html',
})
export class NewsListPage {
  private router = inject(Router);
  private readonly newsService = inject(NewsService)

  // ─── ESTADOS
  readonly selectedItem = signal<NewsModel | null>(null);
  readonly openDeleteModal = signal(false);
  private readonly isDeleting = signal(false);
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
  
  // ─── SERVICIO
  private readonly dataResourceRX = rxResource({
    params: () => this.params(),
    stream: ({ params }) => {    
      return this.newsService.getAll(
        params.currentPage, 
        params.items, 
        params.search
      ).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.totalPages.set(response.result.pages);
          return response.result.result;
        })
      );
    },
  });

  readonly newsWithImagesList = computed<NewsWithImagesModel[] | []>(() => {
    const data = this.dataResourceRX.value();
    if (!data) return [];
    return data
  });

  readonly isLoading = computed(() => 
    this.dataResourceRX.isLoading() || this.isDeleting()
  );

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

    this.isDeleting.set(true);
      
    this.newsService.delete(newsWithImagesModel.id_news).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.refreshTrigger.update(v => v + 1);
      },
      error: err => {
        console.error(err);
        this.isDeleting.set(false);
      }
    });
  }

  // ─── MODAL
  closeDeleteModal() {
    this.openDeleteModal.set(false);
    this.selectedItem.set(null);
  }

  // ─── PAGINATION  
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
