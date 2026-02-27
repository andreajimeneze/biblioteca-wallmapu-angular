import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { Role } from "@shared/constants/roles-enum";
import { BookListPage } from "@features/book/pages/book-list-page/book-list-page";
import { InDevelopmentPage } from "@core/pages/in-development-page/in-development-page";

export const  BOOK_ROUTES: Routes = [
  {
    path: '',
    component: BookListPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
  {
    path: 'form',
    component: InDevelopmentPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]