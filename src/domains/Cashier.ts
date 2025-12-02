export interface Cashier {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CashierTable {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export interface NewCashierForm {
  codigo: string;
  nombre: string;
}

export interface NewCashierPayload {
  codigo: string;
  nombre: string;
  activo: boolean;
}

export interface CashierResponse {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export interface UpdateCashierPayload {
  id: string;
  codigo?: string;
  nombre?: string;
  activo?: boolean;
}
