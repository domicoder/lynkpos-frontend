import { useSnackbar } from '@/composables/useSnackbar';
import type {
  CashierTable,
  NewCashierPayload,
  UpdateCashierPayload,
} from '@/domains/Cashier';
import type { ApiError } from '@/domains/Error/ApiError';
import {
  createCashRegister,
  deleteCashier,
  updateCashier,
  deactivateCashRegister,
  openCashier,
  closeCashier,
} from '@/services/cash-register';
import useGlobalStore from '@/stores/GlobalStore';
import useCashierStore from '@/stores/cashier/CashierStore';
import useAuthStore from '@/stores/user/AuthStore';
import { getBadMessage } from '@/utils/api-helpers';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableHeader } from 'vuetify';

const useCashiers = () => {
  const { t } = useI18n();
  const { showSnackbar, showGlobalLoading, hideSnackbar } = useSnackbar();
  const cashierStore = useCashierStore();
  const globalStore = useGlobalStore();
  const authStore = useAuthStore();

  const user = computed(() => authStore.getUser);
  const cashiers = computed(() => cashierStore.getCashiersList);
  const loading = computed(() => cashierStore.isLoading);

  const isAddCashierModalOpen = ref(false);
  const isEditCashierModalOpen = ref(false);
  const cashierIdToDelete = ref<string>('');
  const selectedCashier = ref<CashierTable | null>(null);

  const headers = computed<Readonly<DataTableHeader[]>>(() => [
    { title: t('cashiers.table.code'), key: 'codigo', align: 'start' },
    { title: t('cashiers.table.name'), key: 'nombre', align: 'start' },
    { title: t('cashiers.table.active'), key: 'activo', align: 'center' },
    { title: t('cashiers.table.status'), key: 'estado', align: 'center' },
    {
      title: t('cashiers.table.actions'),
      key: 'actions',
      align: 'center',
      sortable: false,
    },
  ]);

  const fetchCashiers = async () => {
    const result = await cashierStore.fetchCashiers();

    if (!result.success && result.message !== 'Already loading') {
      showSnackbar(
        result.message || t('cashiers.errorLoadingCashiers'),
        'error',
      );
    }
  };

  const refreshCashiers = async () => {
    const result = await cashierStore.refreshCashiers();

    if (result.success) {
      showSnackbar(t('cashiers.cashiersUpdatedSuccessfully'), 'success');
    } else {
      showSnackbar(
        result.message || t('cashiers.errorLoadingCashiers'),
        'error',
      );
    }
  };

  const showAddCashierModal = () => {
    isAddCashierModalOpen.value = true;
  };

  const showEditCashierModal = (cashier: CashierTable) => {
    selectedCashier.value = cashier;
    isEditCashierModalOpen.value = true;
  };

  const handleCreateCashier = async (cashier: NewCashierPayload) => {
    try {
      showGlobalLoading(t('cashiers.addCashierModal.creatingCashier'), true);

      const response = await createCashRegister(cashier);

      hideSnackbar();

      if (response.status === 200) {
        showSnackbar(t('cashiers.cashierCreatedSuccessfully'), 'success');
        isAddCashierModalOpen.value = false;

        await cashierStore.refreshCashiers();
      } else {
        throw new Error('Error al crear nuevo cajero');
      }
    } catch (err) {
      hideSnackbar();
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear nuevo cajero';

      showSnackbar(errorMessage, 'error');
    }
  };

  const handleUpdateCashier = async (cashier: UpdateCashierPayload) => {
    try {
      showGlobalLoading(t('cashiers.editCashierModal.updatingCashier'), true);

      const response = await updateCashier(cashier);

      hideSnackbar();

      if (response.status === 200) {
        showSnackbar(t('cashiers.cashierUpdatedSuccessfully'), 'success');
        isEditCashierModalOpen.value = false;
        selectedCashier.value = null;

        await cashierStore.refreshCashiers();
      } else {
        throw new Error('Error al actualizar cajero');
      }
    } catch (err) {
      hideSnackbar();
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar cajero';

      showSnackbar(errorMessage, 'error');
    }
  };

  const showDeleteCashierModal = (
    title: string,
    message: string,
    cashierId: string,
  ) => {
    globalStore.showConfirmModal(
      true,
      title,
      message,
      handleDeleteCashier,
      handleCancelDelete,
    );
    cashierIdToDelete.value = cashierId;
  };

  const handleDeleteCashier = async () => {
    try {
      showGlobalLoading(t('cashiers.deleteCashierModal.deletingCashier'), true);

      const response = await deleteCashier({ id: cashierIdToDelete.value });

      hideSnackbar();

      if (response.status === 200) {
        showSnackbar(
          t('cashiers.deleteCashierModal.cashierDeletedSuccessfully'),
          'success',
        );

        await cashierStore.refreshCashiers();
      } else {
        throw new Error('Error al eliminar cajero');
      }
    } catch (err) {
      hideSnackbar();
      const errorMessage =
        err instanceof Error ? err.message : 'Error al eliminar cajero';

      showSnackbar(errorMessage, 'error');
    } finally {
      handleCancelDelete();
    }
  };

  const updateCashierStatus = async () => {
    try {
      showGlobalLoading(
        t('cashiers.editCashierModal.updatingCashierStatus'),
        true,
      );

      const response = await deactivateCashRegister({
        id: selectedCashier.value?.id as string,
      });

      hideSnackbar();

      await refreshCashiers();

      if (response.status === 200) {
        showSnackbar(t('cashiers.cashierStatusUpdatedSuccessfully'), 'success');
      } else {
        throw new Error('Error al actualizar estado del cajero');
      }
    } catch (err) {
      hideSnackbar();
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error al actualizar estado del cajero';

      showSnackbar(errorMessage, 'error');
    }
  };

  const handleOpenCashier = async (isClosing: boolean = false) => {
    try {
      if (isClosing) {
        const response = await closeCashier({
          id: selectedCashier.value?.id as string,
          usuarioId: user.value?.id as string,
        });

        if (response.status === 200) {
          showSnackbar(
            t('cashiers.cashierStatusUpdatedSuccessfully'),
            'success',
          );
          await refreshCashiers();
        } else {
          throw new Error('Error al cerrar cajero');
        }

        return;
      } else {
        const response = await openCashier({
          id: selectedCashier.value?.id as string,
          usuarioId: user.value?.id as string,
        });

        if (response.status === 200) {
          showSnackbar(
            t('cashiers.cashierStatusUpdatedSuccessfully'),
            'success',
          );
          await refreshCashiers();
        } else {
          throw new Error('Error al abrir cajero');
        }
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = getBadMessage(
        apiError.response?.data,
        isClosing
          ? t('cashiers.editCashierModal.errorClosingCashier')
          : t('cashiers.editCashierModal.errorOpeningCashier'),
      );

      showSnackbar(errorMessage, 'error');

      return;
    }
  };

  const onOpenCashier = async (cashier: CashierTable) => {
    try {
      selectedCashier.value = cashier;
      if (!cashier) return;

      if (cashier.estado === 'CERRADO') {
        globalStore.showConfirmModal(
          true,
          t('cashiers.editCashierModal.openCashier'),
          t('cashiers.editCashierModal.openCashierMessage'),
          handleOpenCashier,
          () => {},
        );

        return;
      }

      globalStore.showConfirmModal(
        true,
        t('cashiers.editCashierModal.closeCashier'),
        t('cashiers.editCashierModal.closeCashierMessage'),
        () => handleOpenCashier(true),
        () => {},
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = getBadMessage(
        apiError.response?.data,
        t('cashiers.editCashierModal.errorOpeningCashier'),
      );

      showSnackbar(errorMessage, 'error');

      return;
    }
  };

  const handleCancelEdit = () => {
    selectedCashier.value = null;
    isEditCashierModalOpen.value = false;
  };

  const handleCancelDelete = () => {
    cashierIdToDelete.value = '';
    globalStore.clearConfirmModal();
  };

  return {
    cashiers,
    loading,
    headers,
    fetchCashiers,
    refreshCashiers,
    selectedCashier,
    showAddCashierModal,
    showEditCashierModal,
    handleCreateCashier,
    handleUpdateCashier,
    showDeleteCashierModal,
    handleCancelEdit,
    isAddCashierModalOpen,
    isEditCashierModalOpen,
    updateCashierStatus,
    onOpenCashier,
  };
};

export default useCashiers;
