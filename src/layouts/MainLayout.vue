<script setup lang="ts">
  import { lightTheme } from '@/constants/theme';
  import useGlobalStore from '@/stores/GlobalStore';
  import useSnackbarStore from '@/stores/SnackbarStore';
  import { computed, ref, onMounted, onUnmounted } from 'vue';
  import { useResponsiveness } from '@/composables/useResponsiveness';
  import SidebarMenu from '@/components/shared/sidebar-menu/SidebarMenu.vue';
  import Navbar from '@/components/Navbar.vue';

  const globalStore = useGlobalStore();
  const snackbarStore = useSnackbarStore();
  const { handleMountedResize, handleUnmountedResize } = useResponsiveness();

  const drawer = ref(false);

  const currentTheme = computed(() => globalStore.getDocumentTheme);
  const isLightTheme = computed(() => currentTheme.value === lightTheme);

  onMounted(() => {
    handleMountedResize();
  });

  onUnmounted(() => {
    handleUnmountedResize();
  });
</script>

<template>
  <!-- ContextMenu -->
  <v-responsive class="border rounded">
    <v-app>
      <!-- SidebarMenu -->
      <SidebarMenu
        v-model:toggle-sidebar="drawer"
        :is-light-theme="isLightTheme"
      />
      <!-- Navbar -->
      <Navbar v-model:drawer="drawer" />
      <!-- Main content -->
      <v-main>
        <v-container>
          <div class="router-content h-full"><slot></slot></div>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>

  <!-- Global Snackbar -->
  <v-snackbar
    v-model="snackbarStore.show"
    :color="snackbarStore.color"
    :timeout="snackbarStore.timeout"
    location="top"
  >
    {{ snackbarStore.message }}
    <template #actions>
      <v-btn
        variant="text"
        @click="snackbarStore.hide()"
      >
        {{ $t('general.close') }}
      </v-btn>
    </template>
  </v-snackbar>

  <!-- ConfirmDialog -->
</template>

<style lang="scss" scoped></style>
