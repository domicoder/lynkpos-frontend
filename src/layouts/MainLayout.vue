<script setup lang="ts">
  import { lightTheme } from '@/constants/theme';
  import useGlobalStore from '@/stores/GlobalStore';
  import { computed, ref, onMounted, onUnmounted } from 'vue';
  import { useResponsiveness } from '@/composables/useResponsiveness';
  import SidebarMenu from '@/components/shared/sidebar-menu/SidebarMenu.vue';
  import Navbar from '@/components/Navbar.vue';

  const globalStore = useGlobalStore();
  const { handleMountedResize, handleUnmountedResize } = useResponsiveness();

  const currentTheme = computed(() => globalStore.getDocumentTheme);

  const isLightTheme = computed(() => currentTheme.value === lightTheme);

  const drawer = ref(false);

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
  <!-- ToastGroup -->
  <!-- ConfirmDialog -->
</template>

<style lang="scss" scoped></style>
