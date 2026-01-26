import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  
  // ✅ Estado reactivo con señales
  private currentUser = signal<User | null>(this.getStoredUser());
  private isLoading = signal(false);
  
  // ✅ Señales públicas
  user = computed(() => this.currentUser());
  isAuthenticated = computed(() => !!this.currentUser());
  loading = computed(() => this.isLoading());
  
  // ✅ Obtener usuario del localStorage
  private getStoredUser(): User | null {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  }
  
  // ✅ Inicializar Google Identity Services
  initializeGoogleAuth(clientId: string): void {
    // Declarar google como any porque es un script externo
    const google = (window as any).google;
    
    if (!google) {
      console.error('Google Identity Services script no cargado');
      return;
    }
    
    google.accounts.id.initialize({
      client_id: clientId, // Tu Client ID público
      callback: (response: any) => this.handleGoogleResponse(response),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }
  
  // ✅ Manejar respuesta de Google
  private handleGoogleResponse(response: any): void {
    this.isLoading.set(true);
    const googleToken = response.credential; // JWT de Google
    
    console.log('Token recibido de Google:', googleToken.substring(0, 50) + '...');
    
    // ⚠️ POR AHORA: Simulamos login exitoso
    // En la fase 2 esto irá a tu backend Node.js
    
    const mockUser: User = {
      id: 'google_' + Date.now(),
      email: 'usuario.demo@gmail.com',
      name: 'Usuario Demo',
      picture: 'https://img.daisyui.com/images/profile/demo/spiderperson@192.webp'
    };
    
    // Guardar en estado y localStorage
    this.currentUser.set(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    this.isLoading.set(false);
    
    this.router.navigate(['/']);
  }
  
  // ✅ Trigger manual del login (para tu botón)
  triggerGoogleLogin(): void {
    const google = (window as any).google;
    if (google?.accounts?.id) {
      google.accounts.id.prompt(); // Muestra el diálogo de Google
    } else {
      console.error('Google Identity Services no está disponible');
    }
  }
  
  // ✅ Logout
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
