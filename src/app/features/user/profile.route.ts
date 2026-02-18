import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { Role } from "@shared/constants/roles-enum";
import { UserFormPage } from "@features/user/pages/user-form.page/user-form.page";
import { UserListPage } from "./pages/user-list.page/user-list.page";

export const PROFILE_ROUTES: Routes = [
  { 
    path: '', 
    component: UserListPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin, Role.Reader] }
  },
  { 
    path: 'form', 
    component: UserFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin, Role.Reader] } 
  },
];
