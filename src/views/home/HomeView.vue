<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import usePointOfSaleStore from '@/stores/point-of-sale/PointOfSaleStore';
  import type { DataTableHeader } from 'vuetify';
  import { useI18n } from 'vue-i18n';
  import { useSnackbar } from '@/composables/useSnackbar';

  const pointOfSaleStore = usePointOfSaleStore();
  const { t } = useI18n();
  const { showSnackbar } = useSnackbar();

  const products = computed(() => pointOfSaleStore.getProductsList);
  const loading = computed(() =>
    pointOfSaleStore.isResourceLoading('products'),
  );
  const headers = computed<Readonly<DataTableHeader[]>>(() => [
    { title: t('products.table.id'), key: 'productoId', align: 'start' },
    { title: t('products.table.name'), key: 'nombre', align: 'start' },
    { title: t('products.table.price'), key: 'precioUnitario', align: 'start' },
    {
      title: t('products.table.tax'),
      key: 'impuestoPorcentaje',
      align: 'center',
    },
    { title: t('products.table.stock'), key: 'stock', align: 'center' },
  ]);

  const fetchProducts = async () => {
    const result = await pointOfSaleStore.fetchProducts();

    if (!result.success && result.message !== 'Already loading') {
      showSnackbar(
        result.message || t('products.errorLoadingProducts'),
        'error',
      );
    }
  };

  onMounted(() => {
    fetchProducts();
  });
</script>

<template>
  <main class="home">
    <div>
      <div class="flex flex-col">
        <div class="flex flex-col gap-6 h-full">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-6 justify-center font-semibold">
              <span class="text-2xl">{{ $t('products.title') }}</span>
            </div>
            <v-sheet
              border
              rounded
            >
              <v-data-table
                :headers="headers"
                :items="products"
                :loading="loading"
                :items-per-page="10"
                :sort-by="[{ key: 'nombre', order: 'desc' }]"
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

                <template #no-data>
                  <div class="text-center py-8">
                    <v-icon
                      size="64"
                      color="grey-lighten-1"
                      icon="mdi-account-off-outline"
                    />
                    <p class="text-h6 text-grey mt-4">
                      {{ $t('products.noProductsAvailable') }}
                    </p>
                  </div>
                </template>
              </v-data-table>
            </v-sheet>
          </div>
          <div class="flex flex-row gap-6">
            <!-- Show charts here -->
          </div>
          <div class="flex flex-col gap-6 items-end justify-center">
            <span>{{
              $t('general.copyright', {
                year: new Date().getFullYear(),
                appName: $t('general.appNameOnly'),
              })
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
  .project-title {
    color: #64d98a;
  }
</style>
