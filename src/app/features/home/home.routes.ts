import { Routes } from "@angular/router";
import { HomePage } from "@features/home/pages/home-page/home-page";
import { NewsPage } from "@features/home/pages/news-page/news-page";
import { NewsDetailPage } from "@features/home/pages/news-detail-page/news-detail-page";
import { BookDetailsPage } from "@features/public/library/pages/book-details-page/book-details-page";

export const  HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'news',
    component: NewsPage
  },
  {
    path: 'news/:id',
    component: NewsDetailPage
  },
  {
    path: 'book/:id',
    component: BookDetailsPage
  }
]