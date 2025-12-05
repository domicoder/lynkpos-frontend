<script setup lang="ts">
  import { VDataTable } from 'vuetify/components';

  interface AccountsReceivableItem {
    invoiceNumber: string;
    client: string;
    amount: number;
    dueDate: string;
    daysOverdue: number | null;
    status: 'Current' | 'Overdue';
  }

  interface Props {
    items: AccountsReceivableItem[];
    loading: boolean;
  }

  const { items, loading } = defineProps<Props>();

  const emit = defineEmits(['manageItem']);

  const headers: VDataTable['$props']['headers'] = [
    { title: 'Invoice #', key: 'invoiceNumber', sortable: true },
    { title: 'Client', key: 'client', sortable: true },
    { title: 'Amount', key: 'amount', sortable: true },
    { title: 'Due Date', key: 'dueDate', sortable: true },
    { title: 'Days Overdue', key: 'daysOverdue', sortable: true },
    { title: 'Status', key: 'status', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false },
  ];

  /**
   * Emits the item to be managed, to be handled by the parent view.
   */
  const manageItem = (item: AccountsReceivableItem) => {
    emit('manageItem', item);
  };

  const getStatusColor = (status: 'Current' | 'Overdue') => {
    return status === 'Overdue' ? 'red' : 'green';
  };
</script>

<template>
  <div class="d-flex justify-space-between align-center mb-4">
    <h3 class="text-h6 font-weight-bold">
      {{ $t('Pending Credit Invoices') }}
    </h3>
    <v-btn
      variant="text"
      prepend-icon="mdi-download"
    >
      {{ $t('Export') }}
    </v-btn>
  </div>

  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    item-key="invoiceNumber"
    class="elevation-1"
  >
    <template #item.amount="{ item }">
      {{ $t('$') }}
      {{ item.amount.toFixed(2) }}
    </template>

    <template #item.daysOverdue="{ item }">
      <span v-if="item.daysOverdue !== null">
        {{ item.daysOverdue }} {{ $t('general days') }}
      </span>
      <span v-else>
        {{ $t('-') }}
      </span>
    </template>

    <template #item.status="{ item }">
      <v-chip
        :color="getStatusColor(item.status)"
        label
        size="small"
      >
        {{ item.status }}
      </v-chip>
    </template>

    <template #item.actions="{ item }">
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        @click="manageItem(item)"
      >
        {{ $t('general manage') }}
      </v-btn>
    </template>
  </v-data-table>
</template>
