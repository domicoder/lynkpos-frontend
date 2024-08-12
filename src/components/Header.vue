<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts"></script>

<template>
  <header class="header">
    <div class="flex flex-col items-center justify-center">
      <p>
        <img
          src="@/assets/images/vuetres-template-logo.svg"
          alt="logo"
          width="50"
        />
      </p>
      <div class="flex flex-col w-full items-center justify-center">
        <h1 class="text-lg">
          <p class="project-title italic -skew-y-6">vuetres-template</p>
        </h1>
        <p class="-skew-y-6 pb-4">Vue 3 Starter Template</p>
      </div>
    </div>
  </header>
</template>

<style scoped>
  .project-title {
    color: #64d98a;
  }
</style>
