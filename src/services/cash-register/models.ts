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
