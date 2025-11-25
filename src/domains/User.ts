export interface Role {
  id: string;
  role_name: string;
  description: string;
  created_at: string;
}

export interface Permission {
  id: string;
  permission_name: string;
  description: string;
  created_at: string;
}

export interface LoginToken {
  token: string;
}

export interface User {
  id: string;
  nombre: string;
  usuarioNombre: string;
  rol: {
    id: number;
    nombre: string;
  };
}

export interface UserTable {
  id: string;
  nombre: string;
  usuarioNombre: string;
  activo: boolean;
}

export interface NewUserForm {
  usuarioNombre: string;
  nombre: string;
  password: string;
  confirmPassword: string;
}

export interface NewUserPayload {
  usuarioNombre: string;
  nombre: string;
  password: string;
  activo: boolean;
}
