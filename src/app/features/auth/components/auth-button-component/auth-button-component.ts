import { Component, inject } from '@angular/core';
import { AuthService } from '@features/auth/services/auth-service';

@Component({
  selector: 'app-auth-button-component',
  imports: [],
  templateUrl: './auth-button-component.html',
})
export class AuthButtonComponent {
  private auth = inject(AuthService);
  
  // ✅ Exponer las señales del servicio para el template
  user = this.auth.user;
  isAuthenticated = this.auth.isAuthenticated;
  loading = this.auth.loading;
  
  ngOnInit(): void {
    // ✅ Inicializar Google Auth con tu Client ID
    // REEMPLAZA ESTO con tu Client ID real de Google Cloud Console
    this.auth.initializeGoogleAuth('529904203616-e3rl4utugk5ktbeqbv0ou3itj477gsvd.apps.googleusercontent.com');
  }
  
  // ✅ Método para el botón de login
  login(): void {
    this.auth.triggerGoogleLogin();
  }
  
  // ✅ Método para logout
  logout(): void {
    this.auth.logout();
  }
}
