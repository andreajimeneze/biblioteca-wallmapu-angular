import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { GenreFormPage } from "@features/book-genre/pages/genre-form-page/genre-form-page";
import { Role } from "@shared/constants/roles-enum";

export const  BOOK_GENRE_ROUTES: Routes = [
  {
    path: '',
    component: GenreFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]
