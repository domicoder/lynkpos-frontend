<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import BlankLayout from '@/layouts/BlankLayout.vue';
  import MainLayout from '@/layouts/MainLayout.vue';
  import useGlobalStore from '@/stores/GlobalStore';
  import { useI18n } from 'vue-i18n';
  import type { I18nLanguage } from '@/constants/theme';

  const router = useRouter();
  const globalStore = useGlobalStore();
  const i18n = useI18n();

  const currentLanguage = computed(() => globalStore.getDocumentLanguage);

  const initDocumentTheme = () => {
    globalStore.initDocumentTheme();
  };
  const initDocumentLanguage = () => {
    globalStore.setLanguage(currentLanguage.value as I18nLanguage);
    i18n.locale.value = currentLanguage.value;
  };
  const requiresAuth = computed(() => {
    return router?.currentRoute.value?.meta?.requiresAuth;
  });

  onMounted(() => {
    initDocumentTheme();
    initDocumentLanguage();
  });
</script>

<template>
  <component :is="requiresAuth ? MainLayout : BlankLayout">
    <router-view />
  </component>
</template>
