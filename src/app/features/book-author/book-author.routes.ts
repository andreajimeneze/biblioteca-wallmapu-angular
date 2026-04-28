import { authGuard } from "@core/guards/auth-guard";
import { Role } from "@shared/constants/roles-enum";
import { AuthorFormPage } from "./pages/author-form-page/author-form-page";
import { Routes } from "@angular/router";

export const  BOOK_AUTHOR_ROUTES: Routes = [
  {
    path: '',
    component: AuthorFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]