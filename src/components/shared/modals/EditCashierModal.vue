<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import BaseModal from '@/components/shared/modals/BaseModal.vue';
  import type { VForm } from 'vuetify/components';
  import type { CashierTable, UpdateCashierPayload } from '@/domains/Cashier';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  interface Props {
    cashier: CashierTable | null;
  }

  const props = defineProps<Props>();
  const open = defineModel<boolean>({ default: false });

  const emit = defineEmits<{
    (e: 'submit', cashier: UpdateCashierPayload): void;
    (e: 'cancel'): void;
    (e: 'updateCashierStatus'): void;
  }>();

  // --- State ---
  const formRef = ref<VForm | null>(null);
  const isValid = ref(false);
  const isSubmitting = ref(false);

  const form = reactive({
    id: '',
    codigo: '',
    nombre: '',
    activo: true,
  });

  // --- Validation rules ---
  type RuleFn = (value: string) => true | string;

  const required =
    (field: string): RuleFn =>
    (v) =>
      !!v || `${field} es requerido`;
  const minLength =
    (min: number): RuleFn =>
    (v) =>
      !v || v.length >= min || `Mínimo ${min} caracteres`;

  const codeRules = [required('Código'), minLength(2)];
  const nameRules = [required('Nombre'), minLength(2)];

  // --- Helpers ---
  const resetForm = () => {
    form.id = '';
    form.codigo = '';
    form.nombre = '';
    form.activo = true;
    isValid.value = false;
    formRef.value?.resetValidation();
  };

  const loadCashierData = () => {
    if (!props.cashier) return;

    form.id = props.cashier.id;
    form.codigo = props.cashier.codigo;
    form.nombre = props.cashier.nombre;
    form.activo = props.cashier.activo;
  };

  // Cargar datos al cambiar cashier
  watch(
    () => props.cashier,
    (cashier) => {
      if (cashier && open.value) loadCashierData();
    },
    { immediate: true },
  );

  // Abrir/cerrar modal
  watch(open, (state) => {
    if (!state) {
      resetForm();
    } else if (props.cashier) {
      loadCashierData();
    }
  });

  // --- Submit ---
  const onSubmit = async () => {
    if (isSubmitting.value || !formRef.value) return;

    const { valid } = await formRef.value.validate();

    if (!valid) return;

    isSubmitting.value = true;

    try {
      const payload: UpdateCashierPayload = {
        id: form.id,
        codigo: form.codigo.trim(),
        nombre: form.nombre.trim(),
        activo: form.activo,
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

  const updateCashierStatus = () => {
    emit('updateCashierStatus');
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
        {{ t('cashiers.editCashierModal.title') }}
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
            :label="t('cashiers.editCashierModal.code')"
            :rules="codeRules"
            variant="outlined"
            density="comfortable"
            autocomplete="off"
            required
          />

          <!-- Nombre -->
          <v-text-field
            v-model="form.nombre"
            :label="t('cashiers.editCashierModal.name')"
            :rules="nameRules"
            variant="outlined"
            density="comfortable"
            autocomplete="off"
            required
            @input="
              form.nombre = form.nombre.replace(/\b\w/g, (c) => c.toUpperCase())
            "
          />

          <!-- Estado -->
          <div>
            <p class="text-caption mb-1">{{ t('cashiers.status') }}</p>

            <v-switch
              v-model="form.activo"
              :label="
                form.activo ? t('cashiers.active') : t('cashiers.inactive')
              "
              hide-details
              color="success"
              inset
              @update:model-value="updateCashierStatus"
            />
          </div>
        </div>
      </v-form>
    </template>

    <template #actions>
      <v-btn
        variant="text"
        :disabled="isSubmitting"
        @click="handleCancel"
      >
        {{ t('cashiers.editCashierModal.cancel') }}
      </v-btn>

      <v-btn
        color="primary"
        type="submit"
        :loading="isSubmitting"
        :disabled="!isValid || isSubmitting"
        @click="onSubmit"
      >
        {{ t('cashiers.editCashierModal.update') }}
      </v-btn>
    </template>
  </BaseModal>
</template>
