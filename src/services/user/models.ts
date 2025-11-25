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
