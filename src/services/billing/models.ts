import type { InvoiceDetail } from '@/domains/billing/Invoice';

export type TypeList = {
  id: number;
  nombre: string;
};

export type GetTypeListOutputShape = {
  data: TypeList[];
  ok: boolean;
};

export type InvoiceProduct = {
  productoId: string;
  cantidad: number;
};

export type AddInvoiceInputShape = {
  tipoId: number;
  cajaId: string;
  productos: InvoiceProduct[];
};

export type AddInvoiceOutputShape = {
  id: string;
};

export type Invoice = {
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
};

export type GetAllInvoicesOutputShape = {
  data: Invoice[];
  ok: boolean;
};

export type GetInvoiceByIdInputShape = {
  id: string;
};

export type GetInvoiceByIdOutputShape = {
  data: InvoiceDetail;
  ok: boolean;
};
