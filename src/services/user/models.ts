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

// Delete User Types
export type DeleteUserInputShape = {
  id: string;
};

export type DeleteUserOutputShape = {
  deleted?: boolean;
  message?: string;
  ok?: boolean;
};

// Update User Types
export type UpdateUserInputShape = {
  id: string;
  nombre?: string;
  usuarioNombre?: string;
  password?: string;
  activo?: boolean;
};

export type UpdateUserOutputShape = {
  updated?: boolean;
  message?: string;
  ok?: boolean;
};