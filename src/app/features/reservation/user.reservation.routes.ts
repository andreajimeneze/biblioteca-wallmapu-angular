import { Role } from "@shared/constants/roles-enum";
import { UserReservationPage } from "@features/reservation/pages/user-reservation-page/user-reservation-page";
import { authGuard } from "@core/guards/auth-guard";
import { Routes } from "@angular/router";

export const  RESERVATION_ROUTES: Routes = [
  {
    path: '',
    component: UserReservationPage,
    canActivate: [authGuard],
    data: { roles: [Role.Reader]},
  },
]
