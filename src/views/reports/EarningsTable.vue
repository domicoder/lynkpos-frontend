<script setup lang="ts">
  import { VDataTable } from 'vuetify/components';

  interface EarningsItem {
    date: string;
    cashier: string;
    invoices: number;
    creditSales: number;
    debitSales: number;
    incomes: number;
    pending: number;
  }

  interface Props {
    items: EarningsItem[];
    loading: boolean;
  }

  const { items, loading } = defineProps<Props>();

  const headers: VDataTable['$props']['headers'] = [
    { title: 'Date', key: 'date', sortable: true },
    { title: 'Cashier', key: 'cashier', sortable: true },
    { title: 'Invoices', key: 'invoices', sortable: true },
    { title: 'Credit Sales', key: 'creditSales', sortable: true },
    { title: 'Debit Sales', key: 'debitSales', sortable: true },
    { title: 'Incomes', key: 'incomes', sortable: true },
    { title: 'Pending', key: 'pending', sortable: true },
  ];

  /**
   * Helper to get the correct color for pending amount (e.g., if > 0).
   */
  const getPendingColor = (pending: number) => {
    return pending > 0 ? 'red-darken-1' : 'success';
  };
</script>

<template>
  <div class="d-flex justify-space-between align-center mb-4 mt-6">
    <h3 class="text-h6 font-weight-bold">
      {{ $t('Earnings') }}
    </h3>
    <v-btn
      variant="text"
      prepend-icon="mdi-download"
    >
      {{ $t('general.export') }}
    </v-btn>
  </div>

  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    item-key="date"
    class="elevation-1"
  >
    <template #item.incomes="{ item }">
      {{ $t('currency amount', { amount: item.incomes.toFixed(2) }) }}
    </template>

    <template #item.pending="{ item }">
      <span :class="`text-${getPendingColor(item.pending)} font-weight-bold`">
        {{ $t('currency amount', { amount: item.pending.toFixed(2) }) }}
      </span>
    </template>

    <template
      v-if="!loading && items.length === 0"
      #no-data
    >
      <v-alert
        type="info"
        variant="tonal"
        class="ma-2"
      >
        {{ $t('No data available') }}
      </v-alert>
    </template>
  </v-data-table>
</template>
