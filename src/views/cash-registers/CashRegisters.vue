<script setup lang="ts">
  import { onMounted } from 'vue';
  import AddCashierModal from '@/components/shared/modals/AddCashierModal.vue';
  import EditCashierModal from '@/components/shared/modals/EditCashierModal.vue';
  import useCashiers from '@/views/cash-registers/cashiers';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const {
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
    showConfirmModal,
    handleCancelEdit,
    isAddCashierModalOpen,
    isEditCashierModalOpen,
    updateCashierStatus,
  } = useCashiers();

  onMounted(() => {
    fetchCashiers();
  });
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">
        {{ t('cashiers.title') }}
      </h1>
    </div>

    <div class="mt-2 mb-4 d-flex gap-2">
      <v-btn
        :disabled="loading"
        :loading="loading"
        prepend-icon="mdi-refresh"
        rounded="lg"
        :text="t('cashiers.refreshCashiers')"
        variant="text"
        border
        @click="refreshCashiers"
      />

      <v-btn
        :disabled="loading"
        prepend-icon="mdi-cash-register"
        rounded="lg"
        :text="t('cashiers.addCashier')"
        variant="text"
        border
        @click="showAddCashierModal"
      />
    </div>

    <v-sheet
      border
      rounded
    >
      <v-data-table
        :headers="headers"
        :items="cashiers"
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
            {{ item.activo ? t('cashiers.active') : t('cashiers.inactive') }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-2 justify-center">
            <v-btn
              icon="mdi-pencil"
              color="primary"
              variant="text"
              size="small"
              @click="showEditCashierModal(item)"
            />
            <v-btn
              icon="mdi-delete"
              color="error"
              variant="text"
              size="small"
              @click="
                showConfirmModal(
                  t('cashiers.deleteCashierModal.title'),
                  t('cashiers.deleteCashierModal.message'),
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
              icon="mdi-cash-register"
            />
            <p class="text-h6 text-grey mt-4">
              {{ t('cashiers.noCashiersAvailable') }}
            </p>
          </div>
        </template>
      </v-data-table>
    </v-sheet>

    <AddCashierModal
      v-model="isAddCashierModalOpen"
      @submit="handleCreateCashier"
    />

    <EditCashierModal
      v-model="isEditCashierModalOpen"
      :cashier="selectedCashier"
      @submit="handleUpdateCashier"
      @cancel="handleCancelEdit"
      @update-cashier-status="updateCashierStatus"
    />
  </div>
</template>
