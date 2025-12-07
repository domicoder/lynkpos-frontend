import type { InvoiceTable } from '@/domains/billing/Invoice';
import type { CashRegisterTable } from '@/services/cash-register/models';
import type { ProductTable } from '@/services/sales/models';

// Add new resource keys here as you add more endpoints
export type ResourceKey = 'products' | 'cashRegisters' | 'invoices';

export type PointOfSaleState = {
  // Data
  products: ProductTable[];
  cashRegisters: CashRegisterTable[];
  invoices: InvoiceTable[];
  // Unified loading/error/loaded maps - scales infinitely!
  loading: Record<ResourceKey, boolean>;
  loaded: Record<ResourceKey, boolean>;
  errors: Record<ResourceKey, string | null>;
};

const state: PointOfSaleState = {
  products: [],
  cashRegisters: [],
  invoices: [],
  loading: {
    products: false,
    cashRegisters: false,
    invoices: false,
  },
  loaded: {
    products: false,
    cashRegisters: false,
    invoices: false,
  },
  errors: {
    products: null,
    cashRegisters: null,
    invoices: null,
  },
};

export default state;
