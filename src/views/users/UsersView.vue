<script setup lang="ts">
  import { computed, onMounted, ref, shallowRef } from 'vue';
  import type { DataTableHeader } from 'vuetify';
  import type {
    GetUsersListOutputShape,
    UpdateUserInputShape,
  } from '@/services/user';
  import {
    getUsersList,
    createUser,
    deleteUser,
    updateUser,
  } from '@/services/user';
  import { useSnackbar } from '@/composables/useSnackbar';
  import { useI18n } from 'vue-i18n';
  import type { NewUserPayload, UserTable } from '@/domains/User';
  import AddUserModal from '@/components/shared/modals/AddUserModal.vue';
  import EditUserModal from '@/components/shared/modals/EditUserModal.vue';

  const { t } = useI18n();
  const { error, showSnackbar, hasError, showGlobalLoading, hideSnackbar } =
    useSnackbar();

  const loading = shallowRef(false);
  const usersData = shallowRef<GetUsersListOutputShape>();
  const users = computed(() => usersData.value?.data ?? []);

  const isAddUserModalOpen = ref(false);
  const isEditUserModalOpen = ref(false);
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
    loading.value = true;
    error.value = null;

    try {
      const response = await getUsersList({
        page: 1,
        pageSize: 10,
      });

      if (response.data.ok) {
        usersData.value = response.data;
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al cargar usuarios';

      error.value = errorMessage;
      showSnackbar(errorMessage, 'error');
    } finally {
      loading.value = false;
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
    if (!hasError.value) {
      showSnackbar(t('users.usersUpdatedSuccessfully'), 'success');
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
        await fetchUsers();
      } else {
        throw new Error('Error al crear nuevo usuario');
      }
    } catch (err) {
      hideSnackbar();
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear nuevo usuario';

      error.value = errorMessage;
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleUpdateUser = async (user: UpdateUserInputShape) => {
    try {
      showGlobalLoading(t('users.editUserModal.updatingUser'), true);

      const response = await updateUser(user);

      hideSnackbar();

      if (response.status === 200) {
        showSnackbar(t('users.userUpdatedSuccessfully'), 'success');
        isEditUserModalOpen.value = false;
        selectedUser.value = null;
        await fetchUsers();
      } else {
        throw new Error('Error al actualizar usuario');
      }
    } catch (err) {
      hideSnackbar();
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar usuario';

      error.value = errorMessage;
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('users.confirmDelete'))) return;

    try {
      showGlobalLoading(t('users.deletingUser'), true);

      const response = await deleteUser({ id: userId });

      hideSnackbar();

      if (response.status === 200) {
        showSnackbar(t('users.userDeletedSuccessfully'), 'success');
        await fetchUsers();
      } else {
        throw new Error('Error al eliminar usuario');
      }
    } catch (err) {
      hideSnackbar();
      const errorMessage =
        err instanceof Error ? err.message : 'Error al eliminar usuario';

      showSnackbar(errorMessage, 'error');
    }
  };

  const handleCancelEdit = () => {
    selectedUser.value = null;
    isEditUserModalOpen.value = false;
  };

  onMounted(() => {
    fetchUsers();
  });
</script>

<template>
  <div>
    <div class="mt-2 mb-4 d-flex gap-2">
      <v-btn
        :disabled="loading"
        :loading="loading"
        prepend-icon="mdi-refresh"
        rounded="lg"
        :text="t('users.refreshUsers')"
        variant="text"
        border
        @click="refreshUsers"
      />

      <v-btn
        :disabled="loading"
        prepend-icon="mdi-account-plus"
        rounded="lg"
        :text="t('users.addUser')"
        variant="text"
        border
        @click="showAddUserModal"
      />
    </div>

    <v-sheet
      border
      rounded
    >
      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        :items-per-page="10"
      >
        <template #loading>
          <v-skeleton-loader type="table-row@10" />
        </template>

        <template #item.activo="{ item }">
          <v-chip
            :color="item.activo ? 'success' : 'error'"
            size="small"
            variant="flat"
          >
            {{ item.activo ? t('users.active') : t('users.inactive') }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-2 justify-center">
            <v-btn
              icon="mdi-pencil"
              color="primary"
              variant="text"
              size="small"
              @click="showEditUserModal(item)"
            />
            <v-btn
              icon="mdi-delete"
              color="error"
              variant="text"
              size="small"
              @click="handleDeleteUser(item.id)"
            />
          </div>
        </template>

        <template #no-data>
          <div class="text-center py-8">
            <v-icon
              size="64"
              color="grey-lighten-1"
              icon="mdi-account-off-outline"
            />
            <p class="text-h6 text-grey mt-4">
              {{ $t('users.noUsersAvailable') }}
            </p>
          </div>
        </template>
      </v-data-table>
    </v-sheet>

    <AddUserModal
      v-model="isAddUserModalOpen"
      @submit="handleCreateUser"
    />

    <EditUserModal
      v-model="isEditUserModalOpen"
      :user="selectedUser"
      @submit="handleUpdateUser"
      @cancel="handleCancelEdit"
    />
  </div>
</template>
