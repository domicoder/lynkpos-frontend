<script setup lang="ts">
  import { onMounted } from 'vue';
  import AddUserModal from '@/components/shared/modals/AddUserModal.vue';
  import EditUserModal from '@/components/shared/modals/EditUserModal.vue';
  import useUsers from '@/views/users/users';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const {
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
  } = useUsers();

  onMounted(() => {
    fetchUsers();
  });
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">
        {{ t('users.title').toUpperCase() }}
      </h1>
    </div>

    <div class="mt-2 mb-4 d-flex gap-2">
      <v-btn
        :disabled="loading"
        :loading="loading"
        prepend-icon="mdi-refresh"
        rounded="lg"
        :text="t('users.refreshUsers')"
        color="info"
        size="large"
        border
        @click="refreshUsers"
      />

      <v-btn
        :disabled="loading"
        prepend-icon="mdi-account-plus"
        rounded="lg"
        :text="t('users.addUser')"
        color="success"
        size="large"
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
            {{
              item.activo
                ? t('users.status.active')
                : t('users.status.inactive')
            }}
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
              @click="
                showConfirmModal(
                  t('users.deleteUserModal.title'),
                  t('users.deleteUserModal.message'),
                  item.id,
                )
              "
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
      @update-user-status="updateUserStatus"
    />
  </div>
</template>
