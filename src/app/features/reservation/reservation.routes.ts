import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { ReservationPage } from "@features/reservation/pages/reservation-page/reservation-page";
import { Role } from "@shared/constants/roles-enum";

export const  RESERVATION_ROUTES: Routes = [
  {
    path: '',
    component: ReservationPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]
