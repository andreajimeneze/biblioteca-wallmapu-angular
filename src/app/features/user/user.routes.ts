import { Routes } from "@angular/router";
import { UserProfilePage } from "@features/user/pages/user-profile.page/user-profile.page";
import { authGuard } from "@core/guards/auth-guard";
import { UserFormPage } from "./pages/user-form.page/user-form.page";

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserProfilePage,
  },
  {
    path: 'form',
    component: UserFormPage,
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Lector']},
  },
]