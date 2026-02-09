import { Routes } from "@angular/router";
import { NewsPage } from "@features/admin/news/pages/news-page/news-page";
import { NewsListPage } from "./pages/news-list-page/news-list-page";

export const  NEWS_ROUTES: Routes = [
  {
    path: '',
    component: NewsListPage // NewsPage
  }
]