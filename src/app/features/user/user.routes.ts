import { Routes } from "@angular/router";
import { UserProfilePage } from "@features/user/pages/user-profile.page/user-profile.page";
import { UserListPage } from "@features/user/pages/user-list.page/user-list.page";
import { authGuard } from "@core/guards/auth-guard";

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserProfilePage,
    data: { roles: ['Admin', 'Lector'] },
  },
  {
    path: 'profile',
    component: UserProfilePage,
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Lector']},
  },
  {
    path: 'list',
    component: UserListPage,
    canActivate: [authGuard],
    data: { roles: ['Admin']},
  }
]