<script setup lang="ts">
  import { ref } from 'vue';
  import BaseModal from '@/components/shared/modals/BaseModal.vue';

  interface Props {
    title: string;
    message: string;
  }

  const props = defineProps<Props>();

  const open = defineModel<boolean>({ default: false });

  const emit = defineEmits<{
    (e: 'success'): void;
    (e: 'cancel'): void;
  }>();

  const isSubmitting = ref(false);

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
        variant="text"
        :disabled="isSubmitting"
        @click="handleCancel"
      >
        {{ $t('general.cancel') }}
      </v-btn>

      <v-btn
        color="primary"
        type="submit"
        :loading="isSubmitting"
        :disabled="isSubmitting"
        @click="onSubmit"
      >
        {{ $t('general.confirm') }}
      </v-btn>
    </template>
  </BaseModal>
</template>
