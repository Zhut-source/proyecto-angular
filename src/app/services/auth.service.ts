// En: src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// --- 1. DEFINIMOS LAS INTERFACES AQUÍ MISMO ---

// Para enviar las credenciales
export interface LoginDto {
  username: string;
  password: string;
}

// Para modelar la respuesta REAL de tu API (con PascalCase)
// Esto es un reflejo exacto de tu JSON.
export interface ApiResponse {
  success: boolean;
  message: string;
  accessToken: string;
  data: {
    AccessToken: string;
    RefreshToken?: string;
    User: {
      Id: string;
      Username: string;
      Email: string;
      RoleName: string; // <-- La propiedad clave
    }
  };
}

// Nuestra interfaz INTERNA para la app (limpia y en camelCase)
export interface AppUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7118/api/v1/Auth';

  // --- 2. GESTOR DE ESTADO DEL USUARIO ---
  // BehaviorSubject notificará a toda la app cuando el usuario cambie.
  private currentUserSubject: BehaviorSubject<AppUser | null>;
  public currentUser$: Observable<AppUser | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<AppUser | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Getter para acceder fácilmente al valor actual del usuario
  public get currentUserValue(): AppUser | null {
    return this.currentUserSubject.value;
  }

  // --- 3. MÉTODO LOGIN MEJORADO ---
  login(credentials: LoginDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.success && response.accessToken) {
          localStorage.setItem('jwtToken', response.accessToken);

          // --- "TRADUCCIÓN" DE LA API A NUESTRO MODELO INTERNO ---
          const appUser: AppUser = {
            id: response.data.User.Id,
            username: response.data.User.Username,
            email: response.data.User.Email,
            role: response.data.User.RoleName // Mapeamos RoleName a nuestra propiedad 'role'
          };

          // Guardamos nuestro objeto de usuario limpio
          localStorage.setItem('currentUser', JSON.stringify(appUser));
          // Notificamos a toda la app que el usuario ha cambiado
          this.currentUserSubject.next(appUser);
        }
      }),
      catchError(this.handleError)
    );
  }

  // --- 4. MÉTODO PARA VERIFICAR ROLES ---
  public hasRole(requiredRole: string): boolean {
    if (!this.currentUserValue) {
      return false; // No hay usuario
    }
    // Comparamos el rol del usuario con el requerido (insensible a mayúsculas/minúsculas)
    // Usamos 'Administrator' porque es lo que devuelve tu API.
    return this.currentUserValue.role.toLowerCase() === requiredRole.toLowerCase();
  }

  logout(): void {
    // Limpiamos todo
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error del servidor: ${error.status}.`;
    }
    console.error(`[AuthService] Error: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }
}
