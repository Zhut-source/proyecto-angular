import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// --- ¡CAMBIO AQUÍ! ---
import { CreateUserPayload, ApiResponse } from '../models/user.model'; 
import { RoleDto } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private baseUrl = 'https://localhost:7118/api/v1';

  constructor(private http: HttpClient) { }
  
  getRoles(): Observable<ApiResponse<RoleDto[]>> {
    return this.http.get<ApiResponse<RoleDto[]>>(`${this.baseUrl}/Role/Roles`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * TU LÓGICA AQUÍ ES 100% CORRECTA.
   */
  register(formValues: any): Observable<ApiResponse<any>> {
    const payload: CreateUserPayload = {
      username: formValues.usuario,
      password: formValues.password,
      firstName: formValues.nombre,
      lastName: formValues.apellido,
      email: formValues.email,
      gender: formValues.genero,
      roleId: formValues.rol,
      createdBy: formValues.creadoPor
    };
    
    // La URL es correcta: apunta a /api/v1/User/users
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/User/users`, payload).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Tu manejo de errores es robusto y está correcto.
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.errors) {
      const modelErrors = error.error.errors;
      errorMessage = Object.values(modelErrors).join(' ');
    } else {
      errorMessage = `Error del servidor: ${error.status}.`;
    }
    
    console.error(`[RegistroService] Error: ${errorMessage}`, error);
    return throwError(() => new Error(errorMessage));
  }
}