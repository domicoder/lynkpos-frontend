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

export interface OpenCashRegisterInputShape {
  id: string;

  usuarioId: string;
}

export interface OpenCashRegisterOutputShape {
  ok: boolean;
}
