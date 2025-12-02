import type { CashierTable } from '@/domains/Cashier';

// Crear cajero
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

// Obtener lista de cajeros
export type GetCashiersListOutputShape = {
  pagination: {
    pages: number;
    records: number;
    currentPage: number;
    prevPage: number;
    nextPage: number;
  };
  data: CashierTable[];
  ok: boolean;
};

// Desactivar cajero
export type DeactiveCashRegisterInputShape = {
  id: string;
};

export type DeactiveCashRegisterOutputShape = {
  status: number;
  data: {
    ok: boolean;
  };
};

export type PaginationShape = {
  pages: number;
  records: number;
  currentPage: number;
  prevPage: number;
  nextPage: number;
};

export type CashRegisterTable = {
  id: string;
  estadoId: number;
  codigo: string;
  nombre: string;
  estado: string;
  activo: boolean;
};

export type GetCashierListOutputShape = {
  pagination: PaginationShape;
  data: CashRegisterTable[];
  ok: boolean;
};

// Actualizar cajero
export type UpdateCashierInputShape = {
  id: string;
  codigo?: string;
  nombre?: string;
  activo?: boolean;
};

export type UpdateCashierOutputShape = {
  ok: boolean;
  badMessage?: string;
};

// Eliminar cajero
export type DeleteCashierInputShape = {
  id: string;
};

export type DeleteCashierOutputShape = {
  ok: boolean;
  badMessage?: string;
};
