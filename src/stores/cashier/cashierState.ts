import type { CashierResponse } from '@/domains/Cashier';

export type CashierState = {
  cashiersList: CashierResponse[];
  loading: boolean;
  isLoaded: boolean;
  error: string | null;
};

export const cashierState: CashierState = {
  cashiersList: [],
  loading: false,
  isLoaded: false,
  error: null,
};
