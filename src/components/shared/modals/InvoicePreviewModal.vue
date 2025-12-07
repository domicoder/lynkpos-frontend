<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import BaseModal from '@/components/shared/modals/BaseModal.vue';
  import { useI18n } from 'vue-i18n';
  import useGlobalStore from '@/stores/GlobalStore';

  interface Props {
    /** HTML content to display in the iframe */
    html: string;
    /** Raw total amount for calculations (not formatted) */
    totalToPay: number;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'print'): void;
    (e: 'close'): void;
  }>();

  const open = defineModel<boolean>({ default: false });

  const { t } = useI18n();
  const globalStore = useGlobalStore();

  const amountReceived = ref<number>(0);

  /** Formatted total to pay for display */
  const totalToPayFormatted = computed(() => formatCurrency(props.totalToPay));

  /** Calculate change to give back to customer */
  const changeToGive = computed(() => {
    const received = amountReceived.value || 0;
    const total = props.totalToPay || 0;

    return received >= total ? received - total : 0;
  });

  /** Formatted change to give for display */
  const changeToGiveFormatted = computed(() =>
    formatCurrency(changeToGive.value),
  );

  /**
   * Format a number as USD currency
   * @param value - The numeric value to format
   * @returns Formatted currency string
   */
  const formatCurrency = (value: number): string => {
    return value.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePrint = () => {
    emit('print');
  };

  const handleClose = () => {
    emit('close');
    open.value = false;
  };

  const showConfirmModal = (
    title: string,
    message: string,
    handleConfirm: () => void,
  ) => {
    globalStore.showConfirmModal(true, title, message, handleConfirm, () => {});
  };

  /** Reset amount received when modal opens */
  watch(open, (isOpen) => {
    if (isOpen) {
      amountReceived.value = 0;
    }
  });
</script>

<template>
  <BaseModal
    v-model="open"
    :title="t('salesDashboard.invoicePreview').toUpperCase()"
    :max-width="450"
    :persistent="true"
  >
    <template #default>
      <div class="invoice-preview-container">
        <!-- Payment Summary Section -->
        <div class="payment-summary">
          <!-- Total to Pay -->
          <v-row
            align="center"
            justify="space-between"
            no-gutters
            class="mb-2"
          >
            <v-col cols="auto">
              <span class="text-body-2 font-weight-bold">
                {{ t('salesDashboard.totalSelection').toUpperCase() }}
              </span>
            </v-col>
            <v-col cols="auto">
              <span class="text-body-1 font-weight-bold">
                {{ totalToPayFormatted }}
              </span>
            </v-col>
          </v-row>

          <!-- Amount Received -->
          <v-row
            align="center"
            justify="space-between"
            no-gutters
            class="mb-2"
          >
            <v-col cols="auto">
              <span class="text-body-2 font-weight-bold">
                {{ t('salesDashboard.amountReceived').toUpperCase() }}
              </span>
            </v-col>
            <v-col cols="auto">
              <v-text-field
                v-model.number="amountReceived"
                type="number"
                density="compact"
                hide-details
                min="0"
                step="0.01"
                class="amount-input"
                :placeholder="t('salesDashboard.amountReceivedPlaceholder')"
              />
            </v-col>
          </v-row>

          <!-- Change to Give -->
          <v-row
            align="center"
            justify="space-between"
            no-gutters
            class="mb-3"
          >
            <v-col cols="auto">
              <span class="text-body-2 font-weight-bold">
                {{ t('salesDashboard.changeToGive').toUpperCase() }}
              </span>
            </v-col>
            <v-col cols="auto">
              <span class="text-body-1 font-weight-bold text-success">
                {{ changeToGiveFormatted }}
              </span>
            </v-col>
          </v-row>

          <v-divider class="mb-3" />

          <div class="d-flex justify-end gap-2">
            <v-btn
              variant="text"
              @click="
                showConfirmModal(
                  t('salesDashboard.warning.warningTitle'),
                  t('salesDashboard.warning.warningClosingInvoicePreview'),
                  handleClose,
                )
              "
            >
              {{ t('general.cancel') }}
            </v-btn>

            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-printer"
              @click="handlePrint"
            >
              {{ t('general.print') }}
            </v-btn>
          </div>
        </div>

        <iframe
          :srcdoc="props.html"
          class="invoice-preview-frame"
        ></iframe>
      </div>
    </template>

    <template #actions>
      <span></span>
    </template>
  </BaseModal>
</template>

<style scoped>
  .invoice-preview-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .payment-summary {
    width: 100%;
    margin-bottom: 16px;
  }

  .amount-input {
    max-width: 130px;
  }

  .invoice-preview-frame {
    width: 350px;
    height: 450px;
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 4px;
    background-color: white;
  }
</style>
