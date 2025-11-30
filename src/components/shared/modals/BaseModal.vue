<script setup lang="ts">
  const model = defineModel<boolean>({ default: false });

  interface Props {
    title?: string;
    persistent?: boolean;
    maxWidth?: number | string;
  }

  const {
    title = '',
    persistent = false,
    maxWidth = 500,
  } = defineProps<Props>();

  const close = () => {
    model.value = false;
  };
</script>

<template>
  <v-dialog
    v-model="model"
    :max-width="maxWidth"
    :persistent="persistent"
  >
    <v-card class="pa-2">
      <!-- title -->
      <v-card-title class="text-h6">
        <slot name="title">
          {{ title }}
        </slot>
      </v-card-title>

      <!-- body -->
      <v-card-text>
        <slot></slot>
      </v-card-text>

      <!-- actions -->
      <v-card-actions>
        <v-spacer />
        <slot name="actions">
          <v-btn
            variant="text"
            @click="close"
          >
            {{ $t('general.close') }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
