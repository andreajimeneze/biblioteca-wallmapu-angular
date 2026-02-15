import { Component, computed, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthStore } from '@features/auth/services/auth-store';
import { ROUTES } from '@shared/constants/routes'

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
        return ROUTES.PROTECTED.ADMIN.DASHBOARD
      case 'Lector':
        return ROUTES.PROTECTED.USER.DASHBOARD 
      default:
        return ROUTES.HOME;
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
