<script setup lang="ts">
  import { computed, onMounted, shallowRef } from 'vue';
  import type { DataTableHeader } from 'vuetify';
  import type { GetUsersListOutputShape } from '@/services/user';
  import { getUsersList } from '@/services/user';
  import { useSnackbar } from '@/composables/useSnackbar';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const { error, showSnackbar, hasError } = useSnackbar();

  const loading = shallowRef(false);
  const usersData = shallowRef<GetUsersListOutputShape>();
  const users = computed(() => usersData.value?.data ?? []);

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

  const addUser = () => {
    // TODO: Implement add user dialog/navigation
    showSnackbar('Función en desarrollo', 'success');
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
        @click="addUser"
      />
    </div>

    <!-- Error Alert -->
    <v-alert
      v-if="hasError"
      type="error"
      variant="tonal"
      closable
      class="mb-4"
      @click:close="error = null"
    >
      {{ error }}
    </v-alert>

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
  </div>
</template>

<style scoped>
  /* Component-specific styles can be added here */
</style>
