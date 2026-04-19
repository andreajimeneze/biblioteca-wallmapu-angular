import { authGuard } from "@core/guards/auth-guard";
import { Role } from "@shared/constants/roles-enum";
import { Routes } from "@angular/router";
import { AdminReservationPage } from "@features/reservation/pages/admin-reservation-page/admin-reservation-page";

export const  RESERVATION_ROUTES: Routes = [
  {
    path: '',
    component: AdminReservationPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]
