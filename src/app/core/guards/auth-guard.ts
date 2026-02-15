import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@features/auth/services/auth-store';
import { ROUTES } from '@shared/constants/routes';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  const user = authStore.user(); // tu signal actual
  if (!user) {
    router.navigate([ROUTES.HOME]);
    return false;
  }

  // Validación opcional de rol
  const allowedRoles = route.data['roles'] as string[] | undefined;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    router.navigate([ROUTES.HOME]); // o '/unauthorized' si quieres
    return false;
  }
  
  return true;
};
