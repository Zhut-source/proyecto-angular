import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // 'of' nos permite crear un Observable simple
import { tap } from 'rxjs/operators'; // 'tap' nos permite ejecutar código sin modificar la respuesta

// (Opcional pero recomendado) Define una interfaz para las credenciales
export interface AuthCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación
})
export class AuthService {

  // URL de tu API. Déjala preparada.
  private apiUrl = 'https://tu-api.com/auth/login'; // <--- CAMBIA ESTO EN EL FUTURO

  // Inyectamos HttpClient para poder hacer peticiones HTTP en el futuro
  constructor(private http: HttpClient) { }

  /**
   * Método para iniciar sesión.
   * @param credentials - Un objeto con 'username' y 'password'.
   * @returns un Observable que simula la respuesta de la API.
   */
  login(credentials: AuthCredentials): Observable<any> {
    
    console.log('1. [AuthService] Se ha llamado al método login.');
    console.log('2. [AuthService] Credenciales recibidas:', credentials);

    // --- AQUÍ IRÁ TU LLAMADA REAL A LA API EN EL FUTURO ---
    /*
      Cuando estés listo para conectar con el backend, descomenta esta sección
      y elimina la sección "SIMULACIÓN".

      return this.http.post<any>(this.apiUrl, credentials).pipe(
        tap(response => {
          // Aquí manejarías la respuesta exitosa, por ejemplo, guardando un token.
          console.log('Respuesta real de la API:', response);
          // localStorage.setItem('authToken', response.token);
        })
      );
    */

    // --- INICIO DE LA SIMULACIÓN (PARA VER EL OBJETO ENVIADO) ---
    // Por ahora, solo mostraremos que el objeto se envió y devolveremos
    // un Observable simulado que se completa inmediatamente.
    console.log('3. [AuthService] Simulación de llamada a API. Devolviendo un Observable de éxito.');
    const simulacionDeRespuesta = { success: true, user: credentials.username, message: 'Login simulado exitoso' };
    
    return of(simulacionDeRespuesta).pipe(
      tap(response => {
        console.log('4. [AuthService] La simulación ha respondido:', response);
      })
    );
    // --- FIN DE LA SIMULACIÓN ---
  }
}