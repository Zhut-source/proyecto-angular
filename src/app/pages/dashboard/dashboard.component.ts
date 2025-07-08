import { Component, OnInit } from '@angular/core';
import { AuthService, AppUser } from 'src/app/services/auth.service'; // <-- 1. IMPORTA AuthService Y AppUser
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // 2. CREA UNA PROPIEDAD PARA EL OBSERVABLE DEL USUARIO
  public user$: Observable<AppUser | null>;

  constructor(private authService: AuthService) {
    // 3. ASIGNA EL OBSERVABLE DEL SERVICIO A LA PROPIEDAD LOCAL
    this.user$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Podemos suscribirnos para ver los cambios si es necesario para lógica compleja
    this.user$.subscribe(user => {
      console.log('Usuario actual en el dashboard:', user);
    });
  }

  // 4. GETTER PÚBLICO PARA ACCEDER AL SERVICIO DESDE EL HTML
  get auth(): AuthService {
    return this.authService;
  }

  // 5. MÉTODO PARA CERRAR SESIÓN
  logout(): void {
    this.authService.logout();
  }
}