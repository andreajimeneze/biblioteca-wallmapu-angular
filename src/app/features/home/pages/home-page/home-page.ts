import { Component, computed, inject, signal } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { NewsService } from '@features/news/services/news-service';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { NewsFeaturedComponent } from "@features/news/components/news-featured-component/news-featured-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { NewsCardListComponent } from "@features/news/components/news-card-list-component/news-card-list-component";
import { AboutComponent } from '@features/home/components/about-component/about-component';
import { BookService } from '@features/book/services/book-service';
import { BookModel } from '@features/book/models/book-model';
import { BookCardListComponent } from "@features/book/components/book-card-list-component/book-card-list-component";

@Component({
  selector: 'app-home.page',
  imports: [
    HeaderComponent,
    SectionHeaderComponent,
    NewsFeaturedComponent,
    PaginationComponent,
    AboutComponent,
    NewsCardListComponent,
    BookCardListComponent
],
  templateUrl: './home-page.html',
})
export class HomePage {
  private readonly router = inject(Router);
  
  private readonly backendError = signal<string | null>(null);
  private readonly newsService = inject(NewsService);
  private readonly bookService = inject(BookService);

  readonly currentPage = signal(1);
  private readonly limit = signal(8);
  private readonly search = signal('');
  readonly totalPages = signal<number>(0);
  private readonly paramsPayload = computed(() => ({
    currentPage: this.currentPage(),
    limit: this.limit(),
    search: this.search(),
  }));  

  private readonly newsRX = rxResource({
    stream: () => {    
      this.backendError.set(null);

      return this.newsService.getAll(1, 4, '').pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result.result;
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.backendError.set(message);
          return of(null);
        })
      );
    },
  });

  private readonly bookRX = rxResource({
    params: () => this.paramsPayload(),
    stream: ({ params }) => {    
      this.backendError.set(null);

      return this.bookService.getAll(
        params.currentPage, 
        params.limit, 
        params.search
      ).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);

          this.totalPages.set(response.result.pages);

          return response.result.result;
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.backendError.set(message);
          return of(null);
        })
      );
    },
  });  

  protected readonly isLoading = computed(() => this.newsRX.isLoading() || this.bookRX.isLoading());
  protected readonly errorMessage = computed(() => this.backendError());

  protected readonly firstNewsWithImages = computed<NewsWithImagesModel | null>(() => {
    const list = this.newsRX.value() ?? [];
    return list.length > 0 ? list[0] : null;
  });
  protected readonly restNewsWithImages = computed<NewsWithImagesModel[]>(() => {
    const list = this.newsRX.value() ?? [];
    return list.slice(1);
  });
  protected readonly bookListComputed = computed<BookModel[]>(() => this.bookRX.value() ?? []);

  protected actionClicked(){
    this.router.navigate([ROUTES_CONSTANTS.HOME.NEWS.ROOT])
  }

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
