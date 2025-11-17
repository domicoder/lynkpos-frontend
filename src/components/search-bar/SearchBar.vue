<script lang="ts" setup>
  const search = defineModel<string>('search');
</script>

<template>
  <v-toolbar
    floating
    color="transparent"
  >
    <div class="mr-2">
      <v-text-field
        v-model="search"
        density="compact"
        placeholder="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        width="300"
        flat
        hide-details
        single-line
        rounded="xl"
        bg-color="bg-secondary-dark"
        class="border rounded-xl border-border-secondary"
      />
    </div>

    <template #append>
      <v-btn
        color="medium-emphasis"
        density="comfortable"
        icon="mdi-auto-fix"
      />
    </template>
  </v-toolbar>
</template>
