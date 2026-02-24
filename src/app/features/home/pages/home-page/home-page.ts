import { Component, computed, inject } from '@angular/core';
import { map } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { NewsService } from '@features/news/services/news-service';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { NewsFeaturedComponent } from "@features/news/components/news-featured-component/news-featured-component";
import { RecommendedBooksComponent } from "@features/public/home/components/recommended-books-component/recommended-books-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { NewsCardListComponent } from "@features/news/components/news-card-list-component/news-card-list-component";
import { AboutComponent } from '@features/home/components/about-component/about-component';

@Component({
  selector: 'app-home.page',
  imports: [
    HeaderComponent,
    SectionHeaderComponent,
    NewsFeaturedComponent,
    RecommendedBooksComponent,
    PaginationComponent,
    AboutComponent,
    NewsCardListComponent
],
  templateUrl: './home-page.html',
})
export class HomePage {
  private readonly router = inject(Router);
  private readonly newsService = inject(NewsService)

  private readonly newsRX = rxResource({
    stream: () => {    
      return this.newsService.getAll(1, 4, '').pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result.result;
        })
      );
    },
  });

  readonly isLoading = computed(() => this.newsRX.isLoading());
  readonly newsWithImagesList = computed<NewsWithImagesModel[]>(() => this.newsRX.value() ?? []);
  readonly firstNewsWithImages = computed<NewsWithImagesModel | null>(() => {
    const list = this.newsRX.value() ?? [];
    return list.length > 0 ? list[0] : null;
  });
  readonly restNewsWithImages = computed<NewsWithImagesModel[]>(() => {
    const list = this.newsRX.value() ?? [];
    return list.slice(1); // todos menos el primero
  });

  protected actionClicked(){
    this.router.navigate([ROUTES_CONSTANTS.HOME.NEWS])
  }
}
