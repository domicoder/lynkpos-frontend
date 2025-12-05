<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import EarningsTable from '@/views/reports/EarningsTable.vue';
  import CxcTable from '@/views/reports/CxcTable.vue';
  import BaseModal from '@/components/shared/modals/BaseModal.vue';

  // This is an example for an interface (That should be in other file ex. reports.ts)

  interface ReportSummary {
    totalIncomes: number;
    totalIncomesChange: number;
    totalInvoices: number;
    totalInvoicesAverage: number;
    accountsReceivable: number;
    pendingInvoicesCount: number;
    overdueInvoicesAmount: number;
    overdueInvoicesCount: number;
  }

  interface AccountsReceivableItem {
    invoiceNumber: string;
    client: string;
    amount: number;
    dueDate: string;
    daysOverdue: number | null;
    status: 'Vigente' | 'Vencida';
  }

  interface EarningsItem {
    date: string;
    cashier: string;
    invoices: number;
    creditSales: number;
    debitSales: number;
    incomes: number;
    pending: number;
  }

  // Ex. Mock Data (Replace with Api Calls)

  const MOCK_SUMMARY: ReportSummary = {
    totalIncomes: 8191.83,
    totalIncomesChange: 11.1,
    totalInvoices: 30,
    totalInvoicesAverage: 658.37,
    accountsReceivable: 4439.89,
    pendingInvoicesCount: 4,
    overdueInvoicesAmount: 776.25,
    overdueInvoicesCount: 2,
  };

  const MOCK_CXC_ITEMS: AccountsReceivableItem[] = [
    {
      invoiceNumber: '#1001',
      client: 'Empresa ABC S.A.',
      amount: 979.98,
      dueDate: '2024-01-25',
      daysOverdue: null,
      status: 'Vigente',
    },
    {
      invoiceNumber: '#1003',
      client: 'Comercial XYZ Ltda.',
      amount: 729.98,
      dueDate: '2024-01-20',
      daysOverdue: null,
      status: 'Vigente',
    },
    {
      invoiceNumber: '#998',
      client: 'Servicios DEF S.A.S.',
      amount: 450.5,
      dueDate: '2024-01-10',
      daysOverdue: 5,
      status: 'Vencida',
    },
  ];

  const MOCK_EARNINGS_ITEMS: EarningsItem[] = [
    {
      date: '2024-01-15',
      cashier: 'Carlos López',
      invoices: 8,
      creditSales: 3,
      debitSales: 5,
      incomes: 2109.94,
      pending: 1720.96,
    },
    {
      date: '2024-01-14',
      cashier: 'Sofia Martínez',
      invoices: 6,
      creditSales: 2,
      debitSales: 4,
      incomes: 1899.89,
      pending: 529.57,
    },
    {
      date: '2024-01-13',
      cashier: 'Carlos López',
      invoices: 5,
      creditSales: 1,
      debitSales: 4,
      incomes: 1450.75,
      pending: 299.99,
    },
    {
      date: '2024-01-12',
      cashier: 'Juan Pérez',
      invoices: 7,
      creditSales: 3,
      debitSales: 4,
      incomes: 750.8,
      pending: 1299.98,
    },
    {
      date: '2024-01-11',
      cashier: 'Sofia Martínez',
      invoices: 4,
      creditSales: 1,
      debitSales: 3,
      incomes: 980.45,
      pending: 199.99,
    },
  ];

  // Filter Options

  const periodOptions = [
    { title: 'Last Week', value: 'lastWeek' },
    { title: 'Last Month', value: 'lastMonth' },
  ];

  const cashierOptions = [
    { title: 'All Cashiers', value: 'allCashiers' },
    { title: 'Carlos Lopez', value: 'carlos' },
    { title: 'Sofia Martinez', value: 'sofia' },
    { title: 'Juan Pérez', value: 'juan' },
  ];

  const summary = ref<ReportSummary | null>(null);
  const cxcItems = ref<AccountsReceivableItem[]>([]);
  const earningsItems = ref<EarningsItem[]>([]);
  const loadingSummary = ref(false);
  const loadingCxc = ref(false);
  const loadingEarnings = ref(false);

  const period = ref('lastWeek');
  const cashier = ref('allCashiers');

  const manageDialogModel = ref(false);
  const selectedCxcItem = ref<AccountsReceivableItem | null>(null);

  //  Data Loading Functions (REPLACE with API calls)
  // TODO: REPLACE this function to use the actual API endpoint */
  const loadSummaryData = async () => {
    loadingSummary.value = true;
    await new Promise((resolve) => setTimeout(resolve, 300));
    summary.value = MOCK_SUMMARY;
    loadingSummary.value = false;
  };

  // TODO: REPLACE this function to use the actual Accounts Receivable API endpoint.
  // Filters to send: { period: period.value, cashier: cashier.value }
  const loadCxcData = async () => {
    loadingCxc.value = true;
    await new Promise((resolve) => setTimeout(resolve, 300));
    cxcItems.value = MOCK_CXC_ITEMS;
    loadingCxc.value = false;
  };

  // * TODO: REPLACE this function to use the actual API endpoint for Earnings Reporting.
  // * Filters to send: { period: period.value, cashier: cashier.value }
  const loadEarningsData = async () => {
    loadingEarnings.value = true;
    await new Promise((resolve) => setTimeout(resolve, 300));
    earningsItems.value = MOCK_EARNINGS_ITEMS;
    loadingEarnings.value = false;
  };

  const applyFilters = () => {
    loadSummaryData();
    loadEarningsData();
    loadCxcData();
  };

  const openManageDialog = (item: AccountsReceivableItem) => {
    selectedCxcItem.value = item;
    manageDialogModel.value = true;
  };

  onMounted(() => {
    loadSummaryData();
    loadEarningsData();
    loadCxcData();
  });
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h6 mb-4">
          {{ $t('Filters') }}
        </h2>
      </v-col>
    </v-row>

    <v-card class="mb-6 pa-4">
      <v-row align="center">
        <v-col
          cols="12"
          md="4"
          lg="3"
        >
          <v-select
            v-model="period"
            :items="periodOptions"
            item-title="title"
            item-value="value"
            :label="$t('Period:')"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
          lg="3"
        >
          <v-select
            v-model="cashier"
            :items="cashierOptions"
            item-title="title"
            item-value="value"
            :label="$t('Cashier:')"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
          lg="6"
          class="d-flex justify-end"
        >
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            @click="applyFilters"
          >
            {{ $t('Apply Filters') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-row v-if="summary || loadingSummary">
      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pa-4"
          :loading="loadingSummary"
          :disabled="loadingSummary"
        >
          <div class="text-subtitle-1 text-medium-emphasis">
            {{ $t('Total Incomes:') }}
          </div>
          <div class="text-h4 font-weight-bold my-1">
            {{
              $t('currency amount', {
                amount: summary?.totalIncomes.toFixed(2) ?? '---',
              })
            }}
          </div>
          <div v-if="summary">
            <span class="text-success">{{ summary.totalIncomesChange.toFixed(1) }}{{ $t('%') }}
            </span>
            <span class="ml-1 text-medium-emphasis">{{
              $t('reports.summary vs previous period')
            }}</span>
          </div>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pa-4"
          :loading="loadingSummary"
          :disabled="loadingSummary"
        >
          <div class="text-subtitle-1 text-medium-emphasis">
            {{ $t('total Invoices:') }}
          </div>
          <div class="text-h4 font-weight-bold my-1">
            {{ summary?.totalInvoices ?? '---' }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ $t('average') }}
            {{ $t(':') }}
            {{
              $t('currency amount', {
                amount: summary?.totalInvoicesAverage.toFixed(2) ?? '---',
              })
            }}
          </div>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pa-4"
          :loading="loadingSummary"
          :disabled="loadingSummary"
        >
          <div class="text-subtitle-1 text-medium-emphasis">
            {{ $t('Accounts Receivable:') }}
          </div>
          <div class="text-h4 font-weight-bold my-1">
            {{
              $t('currency amount', {
                amount: summary?.accountsReceivable.toFixed(2) ?? '---',
              })
            }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ summary?.pendingInvoicesCount ?? '---' }}
            {{ $t('reports.summary.pendingInvoices') }}
          </div>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pa-4"
          :loading="loadingSummary"
          :disabled="loadingSummary"
        >
          <div class="text-subtitle-1 text-medium-emphasis">
            {{ $t('overdue Invoices:') }}
          </div>
          <div class="text-h4 font-weight-bold my-1">
            {{
              $t('currency amount', {
                amount: summary?.overdueInvoicesAmount.toFixed(2) ?? '---',
              })
            }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ summary?.overdueInvoicesCount ?? '---' }}
            {{ $t('reports.summary.overdueInvoicesCount') }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="pa-4">
          <EarningsTable
            :items="earningsItems"
            :loading="loadingEarnings"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="pa-4">
          <CxcTable
            :items="cxcItems"
            :loading="loadingCxc"
            @manage-item="openManageDialog"
          />
        </v-card>
      </v-col>
    </v-row>

    <BaseModal
      v-model="manageDialogModel"
      :title="$t('Manage Invoice', { number: selectedCxcItem?.invoiceNumber })"
      max-width="800"
    >
      <p>
        {{ $t('Managing Details For:') }}
        <span class="font-weight-bold">{{ selectedCxcItem?.client }}</span>{{ $t('.') }}
      </p>

      <template #actions>
        <v-btn
          color="primary"
          variant="flat"
          disabled
        >
          {{ $t('Take Action') }}
        </v-btn>
      </template>
    </BaseModal>
  </v-container>
</template>
