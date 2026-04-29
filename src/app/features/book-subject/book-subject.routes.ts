import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { SubjectFormPage } from "@features/book-subject/pages/subject-form-page/subject-form-page";
import { Role } from "@shared/constants/roles-enum";

export const  BOOK_SUBJECT_ROUTES: Routes = [
  {
    path: '',
    component: SubjectFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]
