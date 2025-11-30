<script setup lang="ts">
  import { lightTheme } from '@/constants/theme';
  import useGlobalStore from '@/stores/GlobalStore';
  import useSnackbarStore from '@/stores/SnackbarStore';
  import { computed, ref, onMounted, onUnmounted } from 'vue';
  import { useResponsiveness } from '@/composables/useResponsiveness';
  import SidebarMenu from '@/components/shared/sidebar-menu/SidebarMenu.vue';
  import Navbar from '@/components/Navbar.vue';
  import ConfirmModal from '@/components/shared/modals/ConfirmModal.vue';

  const globalStore = useGlobalStore();
  const snackbarStore = useSnackbarStore();
  const { handleMountedResize, handleUnmountedResize } = useResponsiveness();

  const drawer = ref(false);

  const currentTheme = computed(() => globalStore.getDocumentTheme);
  const isLightTheme = computed(() => currentTheme.value === lightTheme);

  const isConfirmModalOpen = computed({
    get: () => globalStore.getIsConfirmModalOpen,
    set: (value: boolean) => globalStore.setIsConfirmModalOpen(value),
  });

  const confirmModalTitle = computed(() => globalStore.getConfirmModalTitle);
  const confirmModalMessage = computed(
    () => globalStore.getConfirmModalMessage,
  );

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
    location="bottom right"
  >
    <div class="d-flex align-center gap-2">
      <div
        v-if="snackbarStore.isLoader"
        class="loader"
      >
        <v-progress-circular
          color="amber"
          indeterminate="disable-shrink"
          size="16"
          width="2"
        />
      </div>
      <div class="text-body-1">
        {{ snackbarStore.message }}
      </div>
    </div>
    <template #actions>
      <v-btn
        variant="text"
        @click="snackbarStore.hide()"
      >
        {{ $t('general.close') }}
      </v-btn>
    </template>
  </v-snackbar>

  <!-- ConfirmModal -->
  <ConfirmModal
    v-if="isConfirmModalOpen"
    v-model="isConfirmModalOpen"
    :title="confirmModalTitle"
    :message="confirmModalMessage"
    @success="globalStore.getHandleConfirm && globalStore.getHandleConfirm()"
    @cancel="globalStore.getHandleCancel && globalStore.getHandleCancel()"
  />
</template>

<style lang="scss" scoped></style>
