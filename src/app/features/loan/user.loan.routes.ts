import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { UserLoanPage } from "@features/loan/pages/user-loan-page/user-loan-page";
import { Role } from "@shared/constants/roles-enum";

export const  LOAN_ROUTES: Routes = [
  {
    path: '',
    component: UserLoanPage,
    canActivate: [authGuard],
    data: { roles: [Role.Reader]},
  },
]
