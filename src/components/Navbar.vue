<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
  import { enLang, esLang, lightTheme } from '@/constants/theme';
  import useGlobalStore from '@/stores/GlobalStore';
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  const i18n = useI18n();
  const globalStore = useGlobalStore();
  const isLightTheme = computed(
    () => globalStore.getDocumentTheme === lightTheme,
  );

  const currentLanguage = computed(() => globalStore.currentLanguage);

  const toggleTheme = () => {
    globalStore.toggleTheme(true);
  };

  const toggleLanguage = () => {
    if (currentLanguage.value === 'es') {
      globalStore.setLanguage(enLang);
    } else {
      globalStore.setLanguage(esLang);
    }

    i18n.locale.value = currentLanguage.value;
  };
</script>

<template>
  <nav class="navbar flex flex-row items-center justify-center gap-6 p-3">
    <a
      href="/"
      class="h-max"
    >
      <i class="oio-icon oio-home"></i>
    </a>
    <a href="/not-found-404">
      <i class="oio-icon oio-question"></i>
    </a>
    <a href="/about">
      <i class="oio-icon oio-notebook"></i>
    </a>
    <button
      class="btn btn-plain"
      @click="toggleTheme"
    >
      <i
        id="theme-toggle__icon"
        class="oio-icon"
        :class="isLightTheme ? 'oio-sun' : 'oio-moon'"
      ></i>
    </button>
    <button
      class="btn btn-plain"
      @click="toggleLanguage"
    >
      <i
        id="language-toggle__icon"
        class="oio-icon oio-language"
      ></i>
    </button>
  </nav>
</template>

<style scoped></style>
