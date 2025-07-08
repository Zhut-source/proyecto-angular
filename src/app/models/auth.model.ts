export interface LoginDto {
  username: string;
  password: string;
}

// 1. CORREGIMOS UserData para que use PascalCase
export interface UserData {
  Id: string;       // Antes era 'id'
  Username: string; // Antes era 'username'
  Email: string;    // Antes era 'email'
  RoleName: string; // Antes era 'role'
}

// 2. CORREGIMOS AuthResponse para que coincida
export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string; // El token de nivel superior
  data: {
    AccessToken: string; // El token dentro de data
    RefreshToken?: string;
    TokenType: string;
    ExpiresIn: number;
    // La clave es que aquí va UserData directamente, no un sub-objeto 'user'
    // TypeScript unirá las propiedades de UserData aquí.
  } & UserData; // <-- Usamos una intersección de tipos para "aplanar" la estructura
}