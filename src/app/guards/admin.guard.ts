import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // La lógica es simple: ¿está logueado Y tiene el rol 'Administrator'?
    if (this.authService.isLoggedIn() && this.authService.hasRole('Administrator')) {
      return true; // Sí, puede pasar
    }

    // Si no, lo redirigimos al dashboard y bloqueamos la navegación.
    console.error('Acceso denegado. Se requiere rol de Administrador.');
    this.router.navigate(['/dashboard']);
    return false; // No, no puede pasar
  }
}