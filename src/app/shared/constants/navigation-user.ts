import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { NavigationModel } from '@shared/models/navigation-model';

export const NAVIGATION_USER: NavigationModel[] = [
  {
    label: 'Panel',
    route: ROUTES_CONSTANTS.PROTECTED.USER.DASHBOARD,
    iconPaths: [
      'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8',
      'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
    ],
    tooltip: 'Panel'
  },
  {
    label: 'Reservas',
    route: ROUTES_CONSTANTS.PROTECTED.USER.RESERVATION.ROOT,
    iconPaths: [
      'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    ],
    tooltip: 'Reservas'
  },
  {
    label: 'Prestamos',
    route: ROUTES_CONSTANTS.PROTECTED.USER.LOAN.ROOT,
    iconPaths: [
      'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
    ],
    tooltip: 'Prestamos'
  },
  {
    label: 'Perfil',
    route: ROUTES_CONSTANTS.PROTECTED.USER.PROFILE.ROOT,
    iconPaths: [
      'M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
    ],
    tooltip: 'Perfil'
  },
]