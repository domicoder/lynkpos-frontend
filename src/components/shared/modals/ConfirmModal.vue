<script setup lang="ts">
  import { computed, ref } from 'vue';
  import BaseModal from '@/components/shared/modals/BaseModal.vue';
  import type { ModalAction } from '@/domains/modal/Actions';
  import { Action } from '@/domains/modal/Actions';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  interface Props {
    title: string;
    message: string;
    actions?: ModalAction[];
  }

  const props = defineProps<Props>();

  const open = defineModel<boolean>({ default: false });

  const emit = defineEmits<{
    (e: 'success'): void;
    (e: 'cancel'): void;
  }>();

  const isSubmitting = ref(false);

  const defaultActions: ModalAction[] = [
    {
      label: t('general.accept'),
      value: Action.Success,
    },
    {
      label: t('general.cancel'),
      value: Action.Cancel,
    },
  ];

  const actions = computed(() => {
    return props.actions && props.actions.length > 0
      ? props.actions
      : defaultActions;
  });

  const onSubmit = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    try {
      emit('success');

      open.value = false;
    } finally {
      isSubmitting.value = false;
    }
  };

  const handleCancel = () => {
    emit('cancel');
    open.value = false;
  };
</script>

<template>
  <BaseModal
    v-model="open"
    :title="props.title"
    :max-width="520"
    :persistent="true"
  >
    <template #default>
      <div class="text-center my-6">
        {{ props.message }}
      </div>
    </template>

    <template #actions>
      <v-btn
        v-if="actions.some((action) => action.value === Action.Cancel)"
        variant="text"
        :disabled="isSubmitting"
        @click="handleCancel"
      >
        {{ actions.find((action) => action.value === Action.Cancel)?.label }}
      </v-btn>

      <v-btn
        v-if="actions.some((action) => action.value === Action.Success)"
        color="primary"
        type="submit"
        :loading="isSubmitting"
        :disabled="isSubmitting"
        @click="onSubmit"
      >
        {{ actions.find((action) => action.value === Action.Success)?.label }}
      </v-btn>
    </template>
  </BaseModal>
</template>
