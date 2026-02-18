import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from '@features/auth/services/auth-google-service';
import { AuthService } from '@features/auth/services/auth-service';
import { AuthUser } from '@features/auth/models/auth-user';
import { ApiAuthGoogleRequest } from '@features/auth/models/api-auth-google-request';
import { ApiAuthGoogleResponse } from '@features/auth/models/api-auth-google-response';
import { firstValueFrom } from 'rxjs';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private router = inject(Router);
  private googleAuth = inject(AuthGoogleService);
  private apiAuth = inject(AuthService);
  
  // 🔹 Signals internas
  private currentUser = signal<AuthUser | null>(this.getStoredUser());
  private isLoading = signal(false);

  // 🔹 Signals públicas
  user = computed(() => this.currentUser());
  isAuthenticated = computed(() => !!this.currentUser());
  loading = computed(() => this.isLoading());

  private getStoredUser(): AuthUser | null {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  }

   // 🔹 Login principal
  async login(): Promise<void> {
    try {
      this.isLoading.set(true);

      // 1️⃣ Obtener access_token de Google
      const googleToken = await this.googleAuth.getAccessToken();
      
      // 2️⃣ Enviar token al backend
      const request: ApiAuthGoogleRequest = { googleToken };
      const response: ApiAuthGoogleResponse = await firstValueFrom(
        this.apiAuth.auth(request)
      ).then(res => res.result);

      // 3️⃣ Guardar JWT
      localStorage.setItem('jwt_token', response.token);

      // 4️⃣ Guardar usuario
      const user: AuthUser = response.user;
      this.currentUser.set(user);
      localStorage.setItem('user', JSON.stringify(user));

      // 5️⃣ Redirigir según profileComplete
      let navigateTo = '';

      switch(user.role) {
        case 'Lector':
          navigateTo = user.profileComplete ? ROUTES_CONSTANTS.PROTECTED.USER.DASHBOARD : ROUTES_CONSTANTS.PROTECTED.USER.PROFILE;
          break;
        case 'Admin':
          navigateTo = user.profileComplete ? ROUTES_CONSTANTS.PROTECTED.ADMIN.DASHBOARD : ROUTES_CONSTANTS.PROTECTED.ADMIN.PROFILE.ROOT;
          break;
        default:
          navigateTo = ROUTES_CONSTANTS.HOME
      }

      this.router.navigate([navigateTo]);
    } catch (error: any) {
      console.error('Error en login:', error);
      alert(error?.message || 'Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // 🔹 Logout
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwt_token');
    this.router.navigate([ROUTES_CONSTANTS.HOME]);
  }
}
