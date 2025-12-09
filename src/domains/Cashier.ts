export type CashierStatus = 'CERRADO' | 'ABIERTO';

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
  estado: CashierStatus;
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
  estado: CashierStatus;
}

export interface UpdateCashierPayload {
  id: string;
  codigo?: string;
  nombre?: string;
  activo?: boolean;
}
