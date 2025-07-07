export interface CreateUserPayload {
  username: string;
  password?: string; // La contraseña puede ser opcional al actualizar
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  roleId: string; // Es un Guid, que en TS es un string
  createdBy: string;
}

// Interfaz genérica para la respuesta de tus APIs
// La has usado en el servicio, así que la movemos aquí para que sea reutilizable.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any; // O un tipo más específico si lo tienes
}