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
