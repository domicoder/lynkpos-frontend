<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
</script>

<template>
  <main class="page-not-found flex flex-col h-full flex-auto justify-center">
    <div class="bg-blackhole absolute inset-0 z-20"></div>
    <div class="not-found-card flex flex-col text-center z-30 gap-4">
      <p class="not-found-card__404 text-white text-xs">
        {{ t('error.pageNotFound.header') }}
      </p>
      <h1
        class="not-found-card__title whitespace-pre-wrap text-white text-7xl font-semibold"
      >
        {{ t('error.pageNotFound.title') }}
      </h1>
      <p
        class="not-found-card__description whitespace-pre-wrap text-base text-white"
      >
        {{ t('error.pageNotFound.description') }}
      </p>
      <div class="flex flex-col justify-center items-center mt-10 gap-x-6">
        <router-link
          to="/"
          class="text-btn-primary-color hover:text-btn-primary-hover -skew-y-12 bg-btn-primary-bg w-max px-4 py-1"
        >
          {{ t('general.backHome') }}
        </router-link>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
  @import '@/styles/settings/variables.scss';
  @import '@/styles/tools/mixins.scss';

  .page-not-found {
    .not-found-card {
      &__title {
        line-height: 1.2em;
      }
    }

    .bg-blackhole {
      background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
        url('@/assets/images/backgrounds/bg-black-hole-vuetres.jpg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
</style>
