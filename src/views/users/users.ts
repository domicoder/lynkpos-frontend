import { useSnackbar } from '@/composables/useSnackbar';
import type { NewUserPayload, UserTable } from '@/domains/User';
import type { UpdateUserInputShape } from '@/services/user';
import {
  createUser,
  deactivateUserById,
  deleteUser,
  updateUser,
} from '@/services/user';
import useGlobalStore from '@/stores/GlobalStore';
import useUserStore from '@/stores/user/UserStore';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataTableHeader } from 'vuetify';

const useUsers = () => {
  const { t } = useI18n();
  const { showSnackbar, showGlobalLoading, hideSnackbar } = useSnackbar();
  const userStore = useUserStore();
  const globalStore = useGlobalStore();

  const users = computed(() => userStore.getUsersList);
  const loading = computed(() => userStore.isLoading);

  const isAddUserModalOpen = ref(false);
  const isEditUserModalOpen = ref(false);
  const userIdToDelete = ref<string>('');
  const selectedUser = ref<UserTable | null>(null);

  const headers = computed<Readonly<DataTableHeader[]>>(() => [
    { title: t('users.table.name'), key: 'nombre', align: 'start' },
    { title: t('users.table.username'), key: 'usuarioNombre', align: 'start' },
    { title: t('users.table.active'), key: 'activo', align: 'center' },
    {
      title: t('users.table.actions'),
      key: 'actions',
      align: 'center',
      sortable: false,
    },
  ]);

  const fetchUsers = async () => {
    const result = await userStore.fetchUsers();

    if (!result.success && result.message !== 'Already loading') {
      showSnackbar(result.message || t('users.errorLoadingUsers'), 'error');
    }
  };

  const refreshUsers = async () => {
    const result = await userStore.refreshUsers();

    if (result.success) {
      showSnackbar(t('users.usersUpdatedSuccessfully'), 'success');
    } else {
      showSnackbar(result.message || t('users.errorLoadingUsers'), 'error');
    }
  };

  const showAddUserModal = () => {
    isAddUserModalOpen.value = true;
  };

  const showEditUserModal = (user: UserTable) => {
    selectedUser.value = user;
    isEditUserModalOpen.value = true;
  };

  const handleCreateUser = async (user: NewUserPayload) => {
    try {
      showGlobalLoading(t('users.addUserModal.creatingUser'), true);

      const response = await createUser(user);

      hideSnackbar();

      if (response.status === 200) {
        showSnackbar(t('users.userCreatedSuccessfully'), 'success');
        isAddUserModalOpen.value = false;

        // Refresh users to get the updated list from the server
        await userStore.refreshUsers();
      } else {
        throw new Error('Error al crear nuevo usuario');
      }
    } catch (err) {
      hideSnackbar();
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear nuevo usuario';

      showSnackbar(errorMessage, 'error');
    }
  };

  const handleUpdateUser = async (user: UpdateUserInputShape) => {
    try {
      // handle validation for usuarioNombre and nombre
      showGlobalLoading(t('users.editUserModal.updatingUser'), true);

      const response = await updateUser(user);

      hideSnackbar();

      if (response.status === 200) {
        showSnackbar(t('users.userUpdatedSuccessfully'), 'success');
        isEditUserModalOpen.value = false;
        selectedUser.value = null;

        // Refresh users to get the updated list from the server
        await userStore.refreshUsers();
      } else {
        throw new Error('Error al actualizar usuario');
      }
    } catch (err) {
      hideSnackbar();
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar usuario';

      showSnackbar(errorMessage, 'error');
    }
  };

  const showConfirmModal = (title: string, message: string, userId: string) => {
    globalStore.showConfirmModal(
      true,
      title,
      message,
      handleDeleteUser,
      handleCancelDelete,
    );
    userIdToDelete.value = userId;
  };

  const handleDeleteUser = async () => {
    try {
      showGlobalLoading(t('users.deleteUserModal.deletingUser'), true);

      const response = await deleteUser({ id: userIdToDelete.value });

      hideSnackbar();

      if (response.status === 200) {
        showSnackbar(
          t('users.deleteUserModal.userDeletedSuccessfully'),
          'success',
        );

        // Refresh users to get the updated list from the server
        await userStore.refreshUsers();
      } else {
        throw new Error('Error al eliminar usuario');
      }
    } catch (err) {
      hideSnackbar();
      const errorMessage =
        err instanceof Error ? err.message : 'Error al eliminar usuario';

      showSnackbar(errorMessage, 'error');
    } finally {
      handleCancelDelete();
    }
  };

  const updateUserStatus = async () => {
    try {
      showGlobalLoading(t('users.editUserModal.updatingUserStatus'), true);

      const response = await deactivateUserById({
        id: selectedUser.value?.id as string,
      });

      hideSnackbar();

      // TODO: change user status in store and replace next call forced to refresh users
      await refreshUsers();

      if (response.status === 200) {
        showSnackbar(
          t('users.editUserModal.userStatusUpdatedSuccessfully'),
          'success',
        );
      } else {
        throw new Error('Error al actualizar estado del usuario');
      }
    } catch (err) {
      hideSnackbar();
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error al actualizar estado del usuario';

      showSnackbar(errorMessage, 'error');
    }
  };

  const handleCancelEdit = () => {
    selectedUser.value = null;
    isEditUserModalOpen.value = false;
  };

  const handleCancelDelete = () => {
    userIdToDelete.value = '';
    globalStore.clearConfirmModal();
  };

  return {
    users,
    loading,
    headers,
    fetchUsers,
    refreshUsers,
    selectedUser,
    showAddUserModal,
    showEditUserModal,
    handleCreateUser,
    handleUpdateUser,
    showConfirmModal,
    handleCancelEdit,
    isAddUserModalOpen,
    isEditUserModalOpen,
    updateUserStatus,
  };
};

export default useUsers;
