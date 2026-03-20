import { Routes } from "@angular/router";
import { HomePage } from "@features/home/pages/home-page/home-page";
import { NewsPage } from "@features/home/pages/news-page/news-page";
import { NewsDetailPage } from "@features/home/pages/news-detail-page/news-detail-page";
import { EditionDetailPage } from "./pages/edition-detail-page/edition-detail-page";

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
    path: 'book/:bookId',
    component: EditionDetailPage
  },
  {
    path: 'book/:bookId/edition/:editionId',
    component: EditionDetailPage
  },  
]