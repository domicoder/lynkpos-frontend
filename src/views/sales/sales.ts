import { useSnackbar } from '@/composables/useSnackbar';
import useGlobalStore from '@/stores/GlobalStore';
import usePointOfSaleStore from '@/stores/point-of-sale/PointOfSaleStore';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableHeader } from 'vuetify';
import type { ProductTable } from '@/services/sales/models';
import { getProductById } from '@/services/sales/api';
import { addInvoice, getInvoiceById } from '@/services/billing/api';
import type { AddInvoiceInputShape } from '@/services/billing/models';
import { printInvoice, getInvoicePreviewHtml } from '@/services/printing/api';
import type { InvoiceDetail } from '@/domains/billing/Invoice';
import type { CashRegisterInvoice } from '@/domains/billing/Invoice';
import { getBadMessage } from '@/utils/api-helpers';
import type { ApiError } from '@/domains/Error/ApiError';

// Singleton refs for invoice preview modal (shared across all useSales calls)
const showModal = ref(false);
const ticketHtml = ref('');

const useSales = () => {
  const { t } = useI18n();
  const { showSnackbar } = useSnackbar();
  const pointOfSaleStore = usePointOfSaleStore();
  const globalStore = useGlobalStore();
  const search = ref<string>('');
  const cashRegisterId = ref<CashRegisterInvoice | null>(null);
  const invoiceDetail = ref<InvoiceDetail | null>(null);

  /** Raw total amount for calculations */
  const totalToPayAmount = computed(() =>
    products.value.reduce(
      (sum, product) =>
        sum +
        (Number(product.precioUnitario) || 0) * (Number(product.stock) || 0),
      0,
    ),
  );

  /** Formatted total for display */
  const totalToPayFormatted = computed(() =>
    totalToPayAmount.value.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  );

  const cashRegisterList = computed<CashRegisterInvoice[]>(() =>
    pointOfSaleStore.getCashRegistersList.map((cashRegister) => ({
      id: cashRegister.id,
      nombre: cashRegister.nombre,
    })),
  );
  const products = ref<ProductTable[]>([]);
  const loading = ref(false);

  // Barcode scanner state
  const barcodeBuffer = ref<string>('');
  const lastKeyTime = ref<number>(0);
  const BARCODE_TIMEOUT_MS = 100; // Max time between keystrokes for barcode scanner

  const isAddProductModalOpen = ref(false);
  const isEditUserModalOpen = ref(false);
  const productIdToDelete = ref<string>('');
  const selectedProduct = ref<ProductTable | null>(null);

  const headers = computed<Readonly<DataTableHeader[]>>(() => [
    { title: t('products.table.id'), key: 'productoId', align: 'center' },
    { title: t('products.table.name'), key: 'nombre', align: 'start' },
    { title: t('products.table.price'), key: 'precioUnitario', align: 'start' },
    {
      title: t('products.table.tax'),
      key: 'impuestoPorcentaje',
      align: 'center',
    },
    { title: t('products.table.stock'), key: 'stock', align: 'center' },
    {
      title: t('products.table.actions'),
      key: 'actions',
      align: 'center',
      sortable: false,
    },
  ]);

  const fetchProductById = async (id: string) => {
    const result = await getProductById(id);

    if (!result.data.ok) {
      showSnackbar(
        result.data.message || t('products.errorLoadingProduct'),
        'error',
      );

      return null;
    }

    return result.data.data;
  };

  const addProductToTable = (product: ProductTable) => {
    const existingIndex = products.value.findIndex(
      (p) => p.productoId === product.productoId,
    );

    if (existingIndex !== -1) {
      // Product already exists, increment stock/quantity
      products.value[existingIndex].stock += 1;
    } else {
      // Add new product with stock = 1
      products.value.push({ ...product, stock: 1 });
    }
  };

  const handleBarcodeScanned = async (barcode: string) => {
    if (!barcode.trim()) return;

    loading.value = true;

    try {
      const product = await fetchProductById(barcode.trim());

      if (product) {
        addProductToTable(product);
        showSnackbar(t('salesDashboard.productAdded'), 'success');
      }
    } catch (error) {
      showSnackbar(t('products.errorLoadingProduct'), 'error');
    } finally {
      loading.value = false;
    }
  };

  const handleBarcodeKeydown = (event: KeyboardEvent) => {
    // Ignore if user is typing in an input field (use SearchBar for manual entry)
    const target = event.target as HTMLElement;

    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    const currentTime = Date.now();

    // Check if this is a new barcode scan (time gap since last key)
    if (currentTime - lastKeyTime.value > BARCODE_TIMEOUT_MS) {
      barcodeBuffer.value = '';
    }

    lastKeyTime.value = currentTime;

    if (event.key === 'Enter') {
      // Barcode scan complete
      if (barcodeBuffer.value.length > 0) {
        handleBarcodeScanned(barcodeBuffer.value);
        barcodeBuffer.value = '';
      }
    } else if (event.key.length === 1) {
      // Single character key (ignore modifiers, arrows, etc.)
      barcodeBuffer.value += event.key;
    }
  };

  const startBarcodeListener = () => {
    window.addEventListener('keydown', handleBarcodeKeydown);
  };

  const stopBarcodeListener = () => {
    window.removeEventListener('keydown', handleBarcodeKeydown);
  };

  const refreshProducts = async () => {
    const result = await pointOfSaleStore.refreshProducts();

    if (result.success) {
      showSnackbar(t('products.productsUpdatedSuccessfully'), 'success');
    } else {
      showSnackbar(
        result.message || t('products.errorLoadingProducts'),
        'error',
      );
    }
  };

  const showAddProductModal = () => {
    isAddProductModalOpen.value = true;
  };

  const showDeleteProductConfirmModal = (
    title: string,
    message: string,
    productId: string,
  ) => {
    globalStore.showConfirmModal(
      true,
      title,
      message,
      handleDeleteProduct,
      handleCancelDelete,
    );
    productIdToDelete.value = productId;
  };

  const handleDeleteProduct = () => {
    try {
      products.value = products.value.filter(
        (product) => product.productoId !== productIdToDelete.value,
      );

      showSnackbar(t('products.productDeletedSuccessfully'), 'success');
    } catch (err) {
      showSnackbar(t('products.error.deletingProduct'), 'error');
    }
  };

  const handleCancelEdit = () => {
    selectedProduct.value = null;
    isEditUserModalOpen.value = false;
  };

  const handleCancelDelete = () => {
    productIdToDelete.value = '';
    globalStore.clearConfirmModal();
  };

  const onAddInvoice = async () => {
    if (!cashRegisterId.value) {
      showSnackbar(t('salesDashboard.selectCashRegister'), 'error');

      return;
    }

    try {
      const input: AddInvoiceInputShape = {
        tipoId: 1,
        cajaId: cashRegisterId.value?.id || '',
        productos: products.value.map((product) => ({
          productoId: product.productoId,
          cantidad: product.stock,
        })),
      };
      const invoiceResult = await addInvoice(input);

      // Get invoice by id to print
      const invoiceDetailById = await getInvoiceById(invoiceResult.data.id);

      if (invoiceDetailById.data.ok) {
        // Print invoice
        invoiceDetail.value = invoiceDetailById.data.data;
        try {
          await runPrintInvoice();
        } catch (error) {
          showSnackbar(t('salesDashboard.errorGeneratingSale'), 'error');
        }

        // Show invoice preview
        await showInvoicePreview(invoiceDetail.value);

        showSnackbar(t('salesDashboard.salesCompletedSuccessfully'), 'success');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = getBadMessage(
        apiError.response?.data,
        t('salesDashboard.errorGeneratingSale'),
      );

      showSnackbar(errorMessage, 'error');

      return;
    }
  };

  const showInvoicePreview = async (invoiceData: InvoiceDetail) => {
    try {
      const response = await getInvoicePreviewHtml({
        ok: true,
        data: invoiceData,
      });

      // Try to get html from different possible structures
      const html = response.data?.html || response.data;

      if (html) {
        ticketHtml.value =
          typeof html === 'string' ? html : JSON.stringify(html);
        showModal.value = true;

        return ticketHtml.value;
      }

      return null;
    } catch (error) {
      showSnackbar(t('salesDashboard.errorGettingPreview'), 'error');

      return null;
    }
  };

  const handleCancelSale = () => {
    products.value = [];
    cashRegisterId.value = null;
  };

  const fetchCashRegisterList = async () => {
    const result = await pointOfSaleStore.fetchCashRegisterList(true);

    if (!result.success && result.message !== 'Already loading') {
      showSnackbar(t('cashRegisters.errorLoadingCashRegisters'), 'error');
    }
  };

  const runPrintInvoice = async () => {
    if (!invoiceDetail.value) {
      showSnackbar(t('salesDashboard.errorGeneratingSale'), 'error');

      return;
    }

    await printInvoice({
      ok: true,
      data: invoiceDetail.value,
    });
  };

  const closeInvoicePreviewModal = () => {
    showModal.value = false;
    invoiceDetail.value = null;
    ticketHtml.value = '';
    products.value = [];
  };

  return {
    products,
    search,
    loading,
    headers,
    refreshProducts,
    selectedProduct,
    showAddProductModal,
    showDeleteProductConfirmModal,
    handleCancelEdit,
    isAddProductModalOpen,
    handleDeleteProduct,
    // Barcode scanner
    startBarcodeListener,
    stopBarcodeListener,
    handleBarcodeScanned,
    onAddInvoice,
    onCancelSale: handleCancelSale,
    cashRegisterId,
    fetchCashRegisterList,
    cashRegisterList,
    showInvoicePreview,
    showModal,
    ticketHtml,
    runPrintInvoice,
    closeInvoicePreviewModal,
    totalToPayAmount,
    totalToPayFormatted,
  };
};

export default useSales;
