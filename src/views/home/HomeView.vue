<script setup lang="ts">
  import salesYearLogo from '@/assets/images/temp/resource-sample1.png';
  import purchasesYearLogo from '@/assets/images/temp/resource-sample2.png';
  import salesAndPurchasesYearLogo from '@/assets/images/temp/resource-sample3.png';
</script>

<template>
  <main class="home">
    <div>
      <div class="flex flex-col">
        <div class="flex flex-col gap-6 h-full">
          <div class="flex flex-col gap-6 justify-center font-semibold">
            {{ $t('home.products') }}
          </div>
          <div class="flex flex-row gap-6">
            <img
              :src="salesYearLogo"
              alt="sales year logo"
              class="h-96 w-full object-cover md:h-full md:w-96"
            />
            <img
              :src="purchasesYearLogo"
              alt="purchases year logo"
              class="h-96 w-full object-cover md:h-full md:w-96"
            />
          </div>
          <div class="flex flex-col gap-6">
            <img
              :src="salesAndPurchasesYearLogo"
              alt="sales and purchases year logo"
              class="h-[790px] w-full object-cover md:h-full md:w-[790px]"
            />
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
