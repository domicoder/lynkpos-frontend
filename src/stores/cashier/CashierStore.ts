import { defineStore } from 'pinia';
import type { CashierResponse } from '@/domains/Cashier';
import { getCashiersList as getCashiersListApi } from '@/services/cash-register';
import type { CashierState } from './cashierState';
import { cashierState } from './cashierState';

export const useCashierStore = defineStore('CashierStore', {
  state: (): CashierState => ({ ...cashierState }),
  actions: {
    async fetchCashiers(forceRefresh = false) {
      if (this.isLoaded && !forceRefresh) {
        return { success: true, data: this.cashiersList };
      }

      if (this.loading) {
        return { success: false, message: 'Already loading' };
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await getCashiersListApi();

        if (response.data.ok && response.data.data) {
          this.cashiersList = response.data.data;
          this.isLoaded = true;

          return { success: true, data: this.cashiersList };
        }

        throw new Error('Failed to fetch cashiers');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error loading cashiers';

        this.error = errorMessage;

        return { success: false, message: errorMessage };
      } finally {
        this.loading = false;
      }
    },

    async refreshCashiers() {
      return await this.fetchCashiers(true);
    },

    setCashiersList(cashiersList: CashierResponse[]) {
      this.cashiersList = cashiersList;
      this.isLoaded = true;
    },

    clearCache() {
      this.cashiersList = [];
      this.isLoaded = false;
      this.error = null;
    },

    updateCashierInList(
      cashierId: string,
      updatedCashier: Partial<CashierResponse>,
    ) {
      const index = this.cashiersList.findIndex(
        (cashier) => cashier.id === cashierId,
      );

      if (index !== -1) {
        this.cashiersList[index] = {
          ...this.cashiersList[index],
          ...updatedCashier,
        };
      }
    },

    removeCashierFromList(cashierId: string) {
      this.cashiersList = this.cashiersList.filter(
        (cashier) => cashier.id !== cashierId,
      );
    },

    addCashierToList(cashier: CashierResponse) {
      this.cashiersList.push(cashier);
    },
  },
  getters: {
    getCashiersList: (state) => state.cashiersList,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    getError: (state) => state.error,
    isDataLoaded: (state) => state.isLoaded,
  },
});

export default useCashierStore;
