import { authGuard } from "@core/guards/auth-guard";
import { UserDashboardPage } from "./pages/user-dashboard-page/user-dashboard-page";
import { Role } from "@shared/constants/roles-enum";
import { Routes } from "@angular/router";

export const DASHBOARD_ROUTES: Routes = [
  { 
    path: '', 
    component: UserDashboardPage,
    canActivate: [authGuard],
    data: { roles: [Role.Reader] }
  },
];