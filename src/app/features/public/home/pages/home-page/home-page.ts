import { Component } from '@angular/core';
import { BannerComponent } from '@features/public/home/components/banner-component/banner-component';
import { RecommendedBooksComponent } from "@features//public/home/components/recommended-books-component/recommended-books-component";
import { LatestNewsComponent } from '../../components/latest-news-component/latest-news-component';

@Component({
  selector: 'app-home-page',
  imports: [
    BannerComponent,
    LatestNewsComponent,
    RecommendedBooksComponent
],
  templateUrl: './home-page.html',
})
export class HomePage {

}
