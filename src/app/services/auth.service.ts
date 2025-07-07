import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// He renombrado la interfaz para que coincida con el nombre de tu DTO en el backend
export interface LoginDto {
  username: string;
  password: string;
}

// Interfaz para la respuesta que esperas de tu API (basado en tu AuthController)
export interface AuthResponse {
  success: boolean;
  message: string;
  data: any; // Puedes definir una interfaz más estricta si quieres
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // === PASO 1: CORRIGE LA URL DE TU API ===
  // Usa la URL que aparece en la consola de Visual Studio cuando ejecutas el backend.
  private apiUrl = 'https://localhost:7118/api/v1/Auth'; // <-- ¡MUY IMPORTANTE CAMBIAR ESTO!

  constructor(private http: HttpClient) { }

  /**
   * Método para iniciar sesión. Conecta con la API real.
   * @param credentials - Un objeto con 'username' y 'password'.
   * @returns un Observable con la respuesta de la API.
   */
  login(credentials: LoginDto): Observable<AuthResponse> {
    
    console.log('[AuthService] Intentando iniciar sesión con:', credentials);

    // === PASO 2: LLAMADA REAL A LA API ===
    // Ahora usamos el método real 'http.post' y eliminamos la simulación.
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // 'tap' se ejecuta cuando la respuesta es exitosa (código 200-299).
        // Aquí guardamos el token JWT que nos devuelve la API.
        if (response && response.success && response.accessToken) {
          console.log('[AuthService] Login exitoso. Respuesta de la API:', response);
          localStorage.setItem('jwtToken', response.accessToken);
          console.log('[AuthService] Token guardado en localStorage.');
        } else {
          // Si success es false pero la API responde con 200 OK (esto no debería pasar, pero por si acaso)
          console.warn('[AuthService] La API respondió con éxito pero el campo "success" es falso.');
        }
      }),
      catchError(this.handleError) // 'catchError' se ejecuta si la API devuelve un error (código 4xx o 5xx).
    );
  }

  /**
   * Método para cerrar sesión.
   */
  logout(): void {
    console.log('[AuthService] Cerrando sesión.');
    localStorage.removeItem('jwtToken');
    // Aquí también podrías redirigir al usuario a la página de login.
    // (necesitarías inyectar `Router` en el constructor)
    // this.router.navigate(['/login']);
  }

  /**
   * Método para obtener el token guardado.
   * @returns el token JWT o null si no existe.
   */
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  /**
   * Método para comprobar si el usuario está autenticado.
   * @returns true si hay un token guardado, false si no.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Manejador de errores centralizado para las peticiones HTTP.
   * Esto te dará mensajes de error mucho más claros en la consola.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red. (Ej: no hay conexión a internet)
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // El backend devolvió un código de error.
      // Tu API devuelve un objeto con un campo "message", así que lo usamos.
      errorMessage = error.error?.message || `Error del servidor: ${error.status}. Por favor, revise la consola del backend.`;
    }
    console.error(`[AuthService] Error en la petición: ${errorMessage}`);
    // Devolvemos un observable que emite el error para que el componente que llamó al login lo pueda manejar.
    return throwError(() => new Error(errorMessage));
  }
}