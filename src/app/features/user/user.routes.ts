import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { UserFormPage } from "@features/user/pages/user-form.page/user-form.page";
import { UserListPage } from "@features/user/pages/user-list.page/user-list.page";

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserListPage,
  },
  {
    path: 'form',
    component: UserFormPage,
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Lector']},
  },
]