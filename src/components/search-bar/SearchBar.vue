<script lang="ts" setup>
  import { toRefs } from 'vue';

  const props = withDefaults(
    defineProps<{
      iconLeft?: string;
      iconRight?: string;
    }>(),
    {
      iconLeft: 'mdi-magnify',
      iconRight: 'mdi-auto-fix',
    },
  );

  const emit = defineEmits<{
    submit: [];
  }>();

  const { iconLeft, iconRight } = toRefs(props);
  const search = defineModel<string>('search', { default: '' });
  const placeholder = defineModel<string>('placeholder', { default: 'Buscar' });

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      emit('submit');
    }
  };
</script>

<template>
  <v-toolbar
    color="transparent"
    class="w-full"
  >
    <div class="mr-2 w-full">
      <v-text-field
        v-model="search"
        density="compact"
        :placeholder="placeholder"
        :prepend-inner-icon="iconLeft"
        variant="solo-filled"
        flat
        hide-details
        single-line
        rounded="xl"
        bg-color="bg-secondary-dark"
        class="border rounded-xl border-border-secondary"
        @keydown="onKeydown"
      />
    </div>

    <template #append>
      <v-btn
        color="medium-emphasis"
        density="comfortable"
        :icon="iconRight"
      />
    </template>
  </v-toolbar>
</template>
