import { defineStore } from 'pinia';
import state from '@/stores/point-of-sale/state';
import type {
  PointOfSaleState,
  ResourceKey,
} from '@/stores/point-of-sale/state';
import { getAllProducts, type ProductTable } from '@/services/sales';
import { getAllInvoices } from '@/services/billing/api';
import { getCashierList } from '@/services/cash-register/api';

type FetchResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export const usePointOfSaleStore = defineStore('PointOfSaleStore', {
  state: (): PointOfSaleState => ({ ...state }),
  actions: {
    /**
     * Generic fetch wrapper - handles loading, errors, and caching automatically
     * Just add new endpoints without worrying about boilerplate!
     */
    async fetchResource<T>(
      key: ResourceKey,
      fetcher: () => Promise<{ data: { ok: boolean; data?: T } }>,
      onSuccess: (data: T) => void,
      forceRefresh = false,
    ): Promise<FetchResult<T>> {
      // Return cached data if available
      if (this.loaded[key] && !forceRefresh) {
        return { success: true, data: this[key] as T };
      }

      // Prevent duplicate requests
      if (this.loading[key]) {
        return { success: false, message: 'Already loading' };
      }

      this.loading[key] = true;
      this.errors[key] = null;

      try {
        const response = await fetcher();

        if (response.data.ok && response.data.data) {
          onSuccess(response.data.data);
          this.loaded[key] = true;

          return { success: true, data: response.data.data };
        }

        throw new Error(`Failed to fetch ${key}`);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : `Error loading ${key}`;

        this.errors[key] = errorMessage;

        return { success: false, message: errorMessage };
      } finally {
        this.loading[key] = false;
      }
    },

    // Clean, simple endpoint methods - no boilerplate!
    async fetchProducts(forceRefresh = false) {
      return this.fetchResource(
        'products',
        getAllProducts,
        (data) => (this.products = data),
        forceRefresh,
      );
    },

    async fetchInvoices(forceRefresh = false) {
      return this.fetchResource(
        'invoices',
        getAllInvoices,
        (data) => (this.invoices = data),
        forceRefresh,
      );
    },

    async refreshInvoices() {
      return this.fetchInvoices(true);
    },

    async refreshProducts() {
      return this.fetchProducts(true);
    },

    setProductsList(products: ProductTable[]) {
      this.products = products;
      this.loaded.products = true;
    },

    clearCache() {
      this.products = [];
      this.cashRegisters = [];
      // Reset all loading states
      (Object.keys(this.loading) as ResourceKey[]).forEach((key) => {
        this.loading[key] = false;
        this.loaded[key] = false;
        this.errors[key] = null;
      });
    },

    async fetchCashRegisterList(forceRefresh = false) {
      return this.fetchResource(
        'cashRegisters',
        getCashierList,
        (data) => (this.cashRegisters = data),
        forceRefresh,
      );
    },

    async refreshCashRegisterList() {
      return this.fetchCashRegisterList(true);
    },

    updateProductInList(
      productId: string,
      updatedProduct: Partial<ProductTable>,
    ) {
      const index = this.products.findIndex(
        (product) => product.productoId === productId,
      );

      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...updatedProduct };
      }
    },

    removeProductFromList(productId: string) {
      this.products = this.products.filter(
        (product) => product.productoId !== productId,
      );
    },

    addProductToList(product: ProductTable) {
      this.products.push(product);
    },
  },
  getters: {
    getProductsList: (state) => state.products,
    getCashRegistersList: (state) => state.cashRegisters,
    getInvoicesList: (state) => state.invoices,

    isResourceLoading: (state) => (key: ResourceKey) => state.loading[key],
    isResourceLoaded: (state) => (key: ResourceKey) => state.loaded[key],
    getResourceError: (state) => (key: ResourceKey) => state.errors[key],

    isAnyLoading: (state) =>
      Object.values(state.loading).some((loading) => loading),
    hasAnyError: (state) =>
      Object.values(state.errors).some((error) => error !== null),
  },
});

export default usePointOfSaleStore;
