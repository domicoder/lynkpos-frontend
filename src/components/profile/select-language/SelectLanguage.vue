<script lang="ts" setup>
  import { computed } from 'vue';
  import selectLanguage from './selectLanguage';

  type Props = {
    isMobile: boolean;
  };

  const props = defineProps<Props>();

  const { languageSelect, toggleLanguage, flagsList } = selectLanguage();

  const showLabel = computed(() => props.isMobile);
</script>

<template>
  <v-select
    v-model="languageSelect"
    :items="flagsList"
    item-title="name"
    label="Language"
    return-object
    single-line
    hide-details
    variant="solo"
    flat
    hide-selected
  >
    <template #selection="{ item }">
      <div class="flex items-center gap-4">
        <img
          :src="item.raw?.flag"
          alt="Flag"
          width="30"
          height="20"
        />
        <span v-if="showLabel">{{ $t('theme.changeTheme') }}</span>
      </div>
    </template>
    <template #item="{ props: itemProps, item }">
      <v-list-item
        v-bind="itemProps"
        class="p-4"
        @click="toggleLanguage"
      >
        <template #title>
          <div class="flex items-center gap-4">
            <img
              :src="item.raw?.flag"
              alt="Flag"
              width="30"
              height="20"
            />
            <span>{{ item.raw?.text }}</span>
          </div>
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>
