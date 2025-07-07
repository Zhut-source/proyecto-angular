export interface RoleDto {
  id: string; // En TypeScript, un Guid es simplemente un string
  name: string;
  description: string;
  isActive: boolean;
  // ... puedes añadir los otros campos si los necesitas en el futuro
}

// Interfaz genérica para la respuesta de tu API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any; // O un tipo más específico si lo tienes
}