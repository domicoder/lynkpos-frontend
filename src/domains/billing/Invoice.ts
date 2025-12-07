import type { CashierRegister } from '@/domains/cashier-register/CashierRegister';

export interface CashRegisterInvoice {
  id: string;
  nombre: string;
}

export interface InvoiceType {
  id: number;
  nombre: string;
}

export interface InvoiceState {
  id: number;
  nombre: string;
}

export interface BillingInvoiceDetail {
  productoId: string;
  nombreProducto: string;
  cantida: number;
  impuestoPorcentaje: number;
  precioUnitario: number;
  total: number;
  subtotal: number;
  impuestos: number;
}

export interface InvoiceDetail {
  id: string;
  tipoID: number;
  estadoId: number;
  cajaId: string;
  usuarioId: string;
  fechaEmision: string;
  total: number;
  subtotal: number;
  impuestos: number;
  tipo: InvoiceType;
  estado: InvoiceState;
  caja: CashierRegister;
  facturaDetalles: BillingInvoiceDetail[];
}

export interface InvoiceTable {
  id: string;
  tipoID: number;
  estadoId: number;
  cajaId: string;
  usuarioId: string;
  fechaEmision: string;
  total: number;
  subtotal: number;
  impuestos: number;
  tipoNombre: string;
  estadoNombre: string;
  cajaCodigo: string;
  cajaNombre: string;
  usuario: string;
  usuarioNombre: string;
}
