import type { UserTable } from '@/domains/User';

export type LoginAuthInputShape = {
  usuarioNombre: string;
  password: string;
};

export type LoginAuthOutputShape = {
  status: number;
  data: {
    token: string;
  };
};

export type GetUserInfoOutputShape = {
  id: string;
  nombre: string;
  usuarioNombre: string;
  rol: {
    id: number;
    nombre: string;
  };
};

export type CreateUserInputShape = {
  nombre: string;
  usuarioNombre: string;
  password: string;
  activo: boolean;
};

export type CreateUserOutputShape = {
  status: number;
  data: {
    id: string;
  };
};

export type PaginationShape = {
  pages: number;
  records: number;
  currentPage: number;
  prevPage: number;
  nextPage: number;
};

export type GetUsersListOutputShape = {
  pagination: PaginationShape;
  data: UserTable[];
  ok: boolean;
};

export type CreateCashRegisterInputShape = {
  codigo: string;
  nombre: string;
  activo: boolean;
};

export type CreateCashRegisterOutputShape = {
  status: number;
  data: {
    id: string;
  };
};
// Input: Lo que envías al backend
export type DeleteUserInputShape = {
  id: string; // El ID del usuario a eliminar
};

// Output: Lo que el backend te devuelve
export type DeleteUserOutputShape = {
  status: number;        // Código HTTP (200, 404, etc.)
  data: {
    deleted: boolean;    // true si se eliminó correctamente
    message?: string;    // Mensaje opcional del servidor
  };
};
