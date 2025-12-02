<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import BaseModal from '@/components/shared/modals/BaseModal.vue';
  import type { VForm } from 'vuetify/components';
  import type { NewCashierForm, NewCashierPayload } from '@/domains/Cashier';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const open = defineModel<boolean>({ default: false });

  const emit = defineEmits<{
    (e: 'submit', cashier: NewCashierPayload): void;
    (e: 'cancel'): void;
  }>();

  // --- State ---
  const formRef = ref<VForm | null>(null);
  const isValid = ref(false);
  const isSubmitting = ref(false);

  const form = reactive<NewCashierForm>({
    codigo: '',
    nombre: '',
  });

  // --- Rules ---
  type RuleFn = (value: string) => true | string;
  const required =
    (f: string): RuleFn =>
    (v) =>
      !!v || `${f} es requerido`;
  const minLength =
    (min: number): RuleFn =>
    (v) =>
      !v || v.length >= min || `Mínimo ${min} caracteres`;

  const codeRules = [required('Código'), minLength(2)];
  const nameRules = [required('Nombre'), minLength(2)];

  const resetForm = () => {
    form.codigo = '';
    form.nombre = '';
    isValid.value = false;
    formRef.value?.resetValidation();
  };

  watch(open, (state) => {
    if (!state) resetForm();
  });

  const onSubmit = async () => {
    if (isSubmitting.value || !formRef.value) return;

    const { valid } = await formRef.value.validate();

    if (!valid) return;

    isSubmitting.value = true;

    try {
      const payload: NewCashierPayload = {
        codigo: form.codigo.trim(),
        nombre: form.nombre.trim(),
        activo: true,
      };

      emit('submit', payload);
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
    :max-width="500"
    :persistent="true"
  >
    <template #title>
      <h2 class="text-h5 font-weight-bold">
        {{ t('cashiers.addCashierModal.title') }}
      </h2>
    </template>

    <template #default>
      <v-form
        ref="formRef"
        v-model="isValid"
        @submit.prevent="onSubmit"
      >
        <div class="d-flex flex-column ga-4">
          <!-- Código -->
          <v-text-field
            v-model="form.codigo"
            :label="t('cashiers.addCashierModal.code')"
            :rules="codeRules"
            variant="outlined"
            density="comfortable"
            autocomplete="off"
            required
          />

          <!-- Nombre -->
          <v-text-field
            v-model="form.nombre"
            :label="t('cashiers.addCashierModal.name')"
            :rules="nameRules"
            variant="outlined"
            density="comfortable"
            autocomplete="off"
            required
            @input="
              form.nombre = form.nombre.replace(/\b\w/g, (c) => c.toUpperCase())
            "
          />
        </div>
      </v-form>
    </template>

    <template #actions>
      <v-btn
        variant="text"
        :disabled="isSubmitting"
        @click="handleCancel"
      >
        {{ t('general.cancel') }}
      </v-btn>

      <v-btn
        color="primary"
        type="submit"
        :loading="isSubmitting"
        :disabled="!isValid || isSubmitting"
        @click="onSubmit"
      >
        {{ t('cashiers.addCashierModal.create') }}
      </v-btn>
    </template>
  </BaseModal>
</template>
