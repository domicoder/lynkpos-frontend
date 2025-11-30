import type { UserTable } from '@/domains/User';

export type LoginAuthInputShape = {
  usuarioNombre: string;
  password: string;
};

export type LoginAuthOutputShape = {
  token: string;
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
  id: string;
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
  id: string;
};

// Delete User Types
export type DeleteUserInputShape = {
  id: string;
};

export type DeleteUserOutputShape = {
  ok: boolean;
  badMessage?: string;
};

export type UpdateUserInputShape = {
  id: string;
  nombre?: string;
  usuarioNombre?: string;
  password?: string;
  activo?: boolean;
};

export type UpdateUserOutputShape = {
  ok: boolean;
  badMessage?: string;
};

export type DeactivateUserByIdInputShape = {
  id: string;
};

export type DeactivateUserByIdOutputShape = {
  ok: boolean;
  badMessage?: string;
};

export type DeactiveCashRegisterInputShape = {
  id: string;
};

export type DeactiveCashRegisterOutputShape = {
  status: number;
  ok: boolean;
};
