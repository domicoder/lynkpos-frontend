<script setup lang="ts">
  import Header from '@/components/Header.vue';
  import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <!-- ContextMenu -->
  <div class="main-container w-full">
    <div class="main-container__header">
      <Header />
    </div>
    <div class="main_container__navbar">
      <Navbar />
    </div>
    <div class="main-container__body mt-3">
      <div class="router-content"><slot></slot></div>
    </div>
  </div>
  <!-- ToastGroup -->
  <!-- ConfirmDialog -->
</template>

<style lang="scss" scoped></style>
