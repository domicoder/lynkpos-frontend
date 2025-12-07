<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
  import { lightTheme } from '@/constants/theme';
  import useGlobalStore from '@/stores/GlobalStore';
  import { computed, onMounted } from 'vue';
  import { useResponsiveness } from '@/composables/useResponsiveness';
  import SelectLanguage from '@/components/profile/select-language/SelectLanguage.vue';
  import MobileAppBar from '@/components/profile/mobile-app-bar/MobileAppBar.vue';
  import UserAvatar from '@/components/profile/user-avatar/UserAvatar.vue';

  const globalStore = useGlobalStore();
  const { isMobile } = useResponsiveness();

  const drawer = defineModel<boolean>('drawer');

  const currentTheme = computed(() => globalStore.getDocumentTheme);
  const isLightTheme = computed(() => currentTheme.value === lightTheme);

  const toggleTheme = () => {
    globalStore.toggleTheme(true);
  };

  const showInitialDrawerDesktop = () => {
    if (!isMobile.value) {
      drawer.value = true;
    }
  };

  onMounted(() => {
    showInitialDrawerDesktop();
  });
</script>

<template>
  <v-app-bar
    elevation="0"
    class="border border-b-[1px]"
  >
    <div class="flex items-center justify-between w-full">
      <v-btn
        icon="mdi-menu"
        class="ml-4"
        @click="drawer = !drawer"
      />
      <div
        v-show="isMobile"
        class="mr-4"
      >
        <MobileAppBar />
      </div>
      <div
        v-show="!isMobile"
        class="flex items-center justify-center gap-2"
      >
        <!-- <SearchBar /> -->
      </div>
      <div
        v-show="!isMobile"
        class="flex items-center justify-center pr-8 gap-3"
      >
        <div class="flex items-center justify-center gap-3">
          <SelectLanguage :is-mobile="isMobile" />
          <UserAvatar />
        </div>
        <div>
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
        </div>
      </div>
    </div>
  </v-app-bar>
</template>

<style scoped></style>
