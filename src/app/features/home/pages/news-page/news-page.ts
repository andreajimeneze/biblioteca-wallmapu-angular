import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { NewsService } from '@features/news/services/news-service';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { catchError, map, of } from 'rxjs';
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { NewsCardListComponent } from "@features/news/components/news-card-list-component/news-card-list-component";

@Component({
  selector: 'app-news-page',
  imports: [
    HeaderComponent,
    SectionHeaderComponent,
    PaginationComponent,
    NewsCardListComponent
],
  templateUrl: './news-page.html',
})
export class NewsPage {
  private readonly newsService = inject(NewsService);
  
  readonly totalPages = signal<number>(1);
  readonly currentPage = signal(1);
  private readonly items = signal(6);
  private readonly search = signal('');

  private readonly params = computed(() => ({
    currentPage: this.currentPage(),
    items: this.items(),
    search: this.search(),
  }));  

  private readonly newsRX = rxResource({
    params: () => this.params(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.newsService.getAll(
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

  readonly isLoading = computed(() => this.newsRX.isLoading());
  readonly newsWithImagesList = computed<NewsWithImagesModel[]>(() => this.newsRX.value() ?? []);

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
