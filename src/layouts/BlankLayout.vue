<script setup lang="ts">
  import ConfirmModal from '@/components/shared/modals/ConfirmModal.vue';
  import useGlobalStore from '@/stores/GlobalStore';
  import { computed } from 'vue';

  const globalStore = useGlobalStore();

  const isConfirmModalOpen = computed({
    get: () => globalStore.getIsConfirmModalOpen,
    set: (value: boolean) => globalStore.setIsConfirmModalOpen(value),
  });

  const confirmModalTitle = computed(() => globalStore.getConfirmModalTitle);
  const confirmModalMessage = computed(
    () => globalStore.getConfirmModalMessage,
  );
  const confirmModalActions = computed(
    () => globalStore.getConfirmModalActions,
  );
</script>

<template>
  <div class="main-blank-container">
    <slot></slot>
  </div>
  <!-- ToastGroup -->
  <ConfirmModal
    v-if="isConfirmModalOpen"
    v-model="isConfirmModalOpen"
    :title="confirmModalTitle"
    :message="confirmModalMessage"
    :actions="confirmModalActions"
  />
</template>

<style lang="scss" scoped></style>
