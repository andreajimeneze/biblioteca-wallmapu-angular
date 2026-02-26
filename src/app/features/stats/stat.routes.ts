import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { Role } from "@shared/constants/roles-enum";
import { StatPage } from "./pages/stat.page/stat.page";

export const STAT_ROUTES: Routes = [
  { 
    path: 'dashboard', 
    component: StatPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin] }
  },
  { 
    path: 'user-stat', 
    component: StatPage,
    canActivate: [authGuard],
    data: { roles: [Role.Reader] } 
  },
];