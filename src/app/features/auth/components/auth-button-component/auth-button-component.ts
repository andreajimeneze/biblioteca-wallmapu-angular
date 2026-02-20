import { Component, computed, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthStore } from '@features/auth/services/auth-store';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant'

@Component({
  selector: 'app-auth-button-component',
  imports: [RouterLink],
  templateUrl: './auth-button-component.html',
})
export class AuthButtonComponent {
  private auth = inject(AuthStore);

  // 🔹 Exponer las signals para el template
  user = this.auth.user;
  isAuthenticated = this.auth.isAuthenticated;
  loading = this.auth.loading;

  navigateTo = computed(() => {
    switch(this.user()?.role) { 
      case 'Admin':
        return ROUTES_CONSTANTS.PROTECTED.ADMIN.DASHBOARD
      case 'Lector':
        return ROUTES_CONSTANTS.PROTECTED.USER.DASHBOARD 
      default:
        return ROUTES_CONSTANTS.HOME;
    }
  });

  // 🔹 Métodos para el template
  login(): void {
    this.auth.login();
  }

  logout(): void {
    this.auth.logout();
  }
}
