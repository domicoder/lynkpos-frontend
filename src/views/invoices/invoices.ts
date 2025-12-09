import { useSnackbar } from '@/composables/useSnackbar';
import usePointOfSaleStore from '@/stores/point-of-sale/PointOfSaleStore';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableHeader } from 'vuetify';

const useInvoices = () => {
  const { t } = useI18n();
  const { showSnackbar } = useSnackbar();
  const pointOfSaleStore = usePointOfSaleStore();

  const invoices = computed(() => pointOfSaleStore.getInvoicesList);
  const loading = computed(() =>
    pointOfSaleStore.isResourceLoading('invoices'),
  );

  const headers = computed<Readonly<DataTableHeader[]>>(() => [
    { title: t('invoices.table.type'), key: 'tipoNombre', align: 'start' },
    { title: t('invoices.table.state'), key: 'estadoNombre', align: 'start' },
    {
      title: t('invoices.table.cashRegister'),
      key: 'cajaNombre',
      align: 'start',
    },
    { title: t('invoices.table.user'), key: 'usuario', align: 'start' },
    {
      title: t('invoices.table.emissionDate'),
      key: 'fechaEmision',
      align: 'start',
    },
    { title: t('invoices.table.taxes'), key: 'impuestos', align: 'start' },
    { title: t('invoices.table.subtotal'), key: 'subtotal', align: 'start' },
    { title: t('invoices.table.total'), key: 'total', align: 'start' },
  ]);

  const fetchInvoices = async () => {
    const result = await pointOfSaleStore.fetchInvoices(true);

    if (!result.success && result.message !== 'Already loading') {
      showSnackbar(
        result.message || t('invoices.errorLoadingInvoices'),
        'error',
      );
    }
  };

  return {
    invoices,
    loading,
    headers,
    fetchInvoices,
  };
};

export default useInvoices;
