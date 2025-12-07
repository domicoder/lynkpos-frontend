<script setup lang="ts">
  import { onMounted } from 'vue';
  import useInvoices from '@/views/invoices/invoices';
  import { formatDate } from '@/utils/dates';

  const { invoices, loading, headers, fetchInvoices } = useInvoices();

  onMounted(() => {
    fetchInvoices();
  });
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-6 justify-center font-semibold">
      <span class="text-2xl">{{ $t('invoices.title').toUpperCase() }}</span>
    </div>
    <v-sheet
      border
      rounded
    >
      <v-data-table
        :headers="headers"
        :items="invoices"
        :loading="loading"
        :items-per-page="10"
      >
        <template #loading>
          <v-skeleton-loader type="table-row@10" />
        </template>

        <template #item.fechaEmision="{ item }">
          {{ formatDate(item.fechaEmision) }}
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
