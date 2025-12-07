<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';
  import useSales from '@/views/sales/sales';
  import { useI18n } from 'vue-i18n';
  import SearchBar from '@/components/search-bar/SearchBar.vue';
  import InvoicePreviewModal from '@/components/shared/modals/InvoicePreviewModal.vue';

  const { t } = useI18n();

  const {
    products,
    search,
    loading,
    headers,
    showDeleteProductConfirmModal,
    startBarcodeListener,
    stopBarcodeListener,
    handleBarcodeScanned,
    onAddInvoice,
    onCancelSale,
    cashRegisterId,
    cashRegisterList,
    fetchCashRegisterList,
    ticketHtml,
    showModal,
    runPrintInvoice,
    closeInvoicePreviewModal,
    totalToPayAmount,
    totalToPayFormatted,
  } = useSales();

  const onSearchSubmit = () => {
    if (search.value.trim()) {
      handleBarcodeScanned(search.value.trim());
      search.value = '';
    }
  };

  onMounted(() => {
    fetchCashRegisterList();
    startBarcodeListener();
  });

  onUnmounted(() => {
    stopBarcodeListener();
  });
</script>

<template>
  <div>
    <div
      v-if="!cashRegisterId"
      class="mb-4"
    >
      <div class="flex items-center justify-center w-full my-4">
        <span class="text-2xl font-weight-bold">{{
          t('salesDashboard.selectCashRegister').toUpperCase()
        }}</span>
      </div>
      <v-select
        v-model="cashRegisterId"
        :items="cashRegisterList"
        item-title="nombre"
        item-value="id"
        :loading="loading"
        :label="t('cashRegisters.title')"
        clearable
        return-object
        class="w-100"
        :placeholder="t('salesDashboard.selectCashRegisterPlaceholder')"
        :disabled="loading"
        @update:model-value="fetchCashRegisterList"
      />
    </div>
    <div v-else>
      <v-card
        class="mb-4 pb-2 pt-2 px-4"
        color="bg-primary-invert"
        flat
      >
        <div class="d-flex align-center justify-space-between">
          <div class="text-h6 font-weight-medium">
            {{ t('salesDashboard.title').toUpperCase() }}
          </div>
          <div class="d-flex flex-column align-end">
            <span class="text-subtitle-1 text-grey-darken-1">
              {{ t('salesDashboard.totalSelection') }}
            </span>
            <span
              class="text-h5 font-weight-bold"
              style="color: var(--primary-accent-invert)"
            >
              {{ totalToPayFormatted }}
            </span>
          </div>
        </div>
      </v-card>

      <div class="h-[44px]">
        <div
          v-if="products.length > 0"
          class="d-flex justify-end mb-4 gap-2"
        >
          <v-btn
            color="success"
            rounded="lg"
            size="large"
            prepend-icon="mdi-cash-register"
            class="font-weight-bold"
            :text="t('salesDashboard.addInvoice')"
            @click="onAddInvoice"
          />
          <v-btn
            color="error"
            rounded="lg"
            size="large"
            prepend-icon="mdi-delete"
            class="font-weight-bold"
            :text="t('salesDashboard.cancelSale')"
            @click="onCancelSale"
          />
        </div>
      </div>

      <SearchBar
        v-model:search="search"
        :placeholder="t('salesDashboard.searchPlaceholder')"
        icon-left="mdi-qrcode-scan"
        @submit="onSearchSubmit"
      />

      <v-sheet
        border
        rounded
        class="mt-4"
      >
        <v-data-table
          :headers="headers"
          :items="products"
          :loading="loading"
          :items-per-page="10"
        >
          <template #loading>
            <v-skeleton-loader type="table-row@10" />
          </template>

          <template #item.activo="{ item }">
            <v-chip
              :color="item.stock > 0 ? 'success' : 'error'"
              size="small"
              variant="flat"
            >
              {{
                item.stock > 0
                  ? t('products.inStock')
                  : t('products.outOfStock')
              }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-2 justify-center">
              <v-btn
                icon="mdi-delete"
                color="error"
                variant="text"
                size="small"
                @click="
                  showDeleteProductConfirmModal(
                    t('salesDashboard.warning.title'),
                    t('salesDashboard.warning.deleteProduct'),
                    item.productoId,
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
                icon="mdi-package-variant"
              />
              <p class="text-h6 text-grey mt-4">
                {{ $t('salesDashboard.noProductsSelected') }}
              </p>
            </div>
          </template>
        </v-data-table>
      </v-sheet>

      <InvoicePreviewModal
        v-model="showModal"
        :html="ticketHtml"
        :total-to-pay="totalToPayAmount"
        @print="runPrintInvoice"
        @close="closeInvoicePreviewModal"
      />
    </div>
  </div>
</template>

<style scoped>
  .project-title {
    color: #64d98a;
  }
</style>
