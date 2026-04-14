import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { CopyFormPage } from "@features/copy/pages/copy-form-page/copy-form-page";
import { Role } from "@shared/constants/roles-enum";

export const  COPY_ROUTES: Routes = [
  {
    path: 'form/:copyId/edition/:editionId/book/:bookId',
    component: CopyFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]
