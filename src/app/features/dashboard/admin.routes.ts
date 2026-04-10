import { Routes } from "@angular/router";
import { AdminDashboardPage } from "./pages/admin-dashboard-page/admin-dashboard-page";
import { authGuard } from "@core/guards/auth-guard";
import { Role } from "@shared/constants/roles-enum";

export const DASHBOARD_ROUTES: Routes = [
  { 
    path: '', 
    component: AdminDashboardPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin] }
  },
];