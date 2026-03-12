import { Routes } from "@angular/router";
import { EditionCopyFormPage } from "./pages/edition-copy-form-page/edition-copy-form-page";
import { authGuard } from "@core/guards/auth-guard";
import { Role } from "@shared/constants/roles-enum";

export const  EDITION_COPY_ROUTES: Routes = [
  {
    path: 'form',
    component: EditionCopyFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]
