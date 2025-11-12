<script setup lang="ts">
  import { computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import BlankLayout from '@/layouts/BlankLayout.vue';
  import MainLayout from '@/layouts/MainLayout.vue';
  import useGlobalStore from '@/stores/GlobalStore';
  import { useI18n } from 'vue-i18n';
  import { lightTheme, type I18nLanguage } from '@/constants/theme';
  import { useTheme } from 'vuetify';

  const vuetifyTheme = useTheme();
  const router = useRouter();
  const globalStore = useGlobalStore();
  const i18n = useI18n();

  const currentLanguage = computed(() => globalStore.getDocumentLanguage);
  const currentTheme = computed(() => globalStore.getDocumentTheme);

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

  const syncVuetifyTheme = () => {
    vuetifyTheme.change(currentTheme.value === lightTheme ? 'light' : 'dark');
  };

  watch(currentTheme, () => {
    syncVuetifyTheme();
  });

  onMounted(() => {
    initDocumentTheme();
    initDocumentLanguage();
    syncVuetifyTheme();
  });
</script>

<template>
  <component :is="requiresAuth ? MainLayout : BlankLayout">
    <router-view />
  </component>
</template>
