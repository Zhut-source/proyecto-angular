export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata: any; // Usamos 'any' por ahora para simplificar
  errors?: any;
}