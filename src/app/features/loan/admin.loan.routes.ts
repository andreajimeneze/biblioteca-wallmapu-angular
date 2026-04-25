import { Routes } from "@angular/router";
import { AdminLoanPage } from "@features/loan/pages/admin-loan-page/admin-loan-page";
import { authGuard } from "@core/guards/auth-guard";
import { Role } from "@shared/constants/roles-enum";

export const  LOAN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLoanPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]
