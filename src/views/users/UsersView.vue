<script setup lang="ts">
  import { computed, onMounted, ref, shallowRef } from 'vue';
  import type { DataTableHeader } from 'vuetify';
  import type { GetUsersListOutputShape } from '@/services/user';
  import { getUsersList, createUser } from '@/services/user';
  import { useSnackbar } from '@/composables/useSnackbar';
  import { useI18n } from 'vue-i18n';
  import type { NewUserPayload } from '@/domains/User';
  import AddUserModal from '@/components/shared/modals/AddUserModal.vue';

  const { t } = useI18n();
  const { error, showSnackbar, hasError, showGlobalLoading } = useSnackbar();

  const loading = shallowRef(false);
  const usersData = shallowRef<GetUsersListOutputShape>();
  const users = computed(() => usersData.value?.data ?? []);
  const isAddUserModalOpen = ref(false);

  const headers = computed<Readonly<DataTableHeader[]>>(() => [
    { title: t('users.table.name'), key: 'nombre', align: 'start' },
    { title: t('users.table.username'), key: 'usuarioNombre', align: 'start' },
    { title: t('users.table.active'), key: 'activo', align: 'center' },
  ]);

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getUsersList();

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
      // eslint-disable-next-line no-console
      console.error('Error fetching users:', err);
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

  const handleCreateUser = async (user: NewUserPayload) => {
    try {
      showGlobalLoading(t('users.addUserModal.creatingUser'), true);

      const response = await createUser(user);

      if (response.status === 200) {
        showSnackbar(t('users.userCreatedSuccessfully'), 'success');
        isAddUserModalOpen.value = false;
        fetchUsers();
      } else {
        throw new Error('Error al crear nuevo usuario');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear nuevo usuario';

      error.value = errorMessage;
      showSnackbar(errorMessage, 'error');
      // eslint-disable-next-line no-console
      console.error('Error creating new user:', err);
    }
  };

  onMounted(() => {
    fetchUsers();
  });
</script>

<template>
  <div>
    <!-- Actions Bar -->
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

    <!-- Users Table -->
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
  </div>
</template>
