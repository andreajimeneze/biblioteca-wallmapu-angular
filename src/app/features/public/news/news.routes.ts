import { Routes } from "@angular/router";
import { NewsPage } from "./pages/news-page/news-page";
import { NewsDetailsPage } from "./pages/news-details-page/news-details-page";

export const  NEWS_ROUTES: Routes = [
  {
    path: '',
    component: NewsPage
  },
  {
    path: ':id',
    component: NewsDetailsPage
  },
]