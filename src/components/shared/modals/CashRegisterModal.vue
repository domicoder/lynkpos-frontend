<script setup lang="ts">
  import { ref } from 'vue';
  import BaseModal from '@/components/shared/modals/BaseModal.vue';

  type CreateCashForm = {
    codigo: string;
    nombre: string;
    activo: boolean;
  };

  const model = defineModel<boolean>({ default: false });

  interface Props {
    loading?: boolean;
    initialCodigo?: string;
    initialNombre?: string;
  }

  const {
    loading = false,
    initialCodigo = '',
    initialNombre = '',
  } = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'submit', payload: CreateCashForm): void;
    (e: 'close'): void;
  }>();

  const codigo = ref(initialCodigo);
  const nombre = ref(initialNombre);
  const activo = ref(true);

  const handleClose = () => {
    model.value = false;
    emit('close');
  };

  const handleSubmit = () => {
    emit('submit', {
      codigo: codigo.value.trim(),
      nombre: nombre.value.trim(),
      activo: activo.value,
    });
  };
</script>

<template>
  <BaseModal
    v-model="model"
    :title="$t('cashRegister.create.title') || 'Crear cajero'"
    :max-width="520"
  >
    <!-- body -->
    <template #default>
      <v-text-field
        v-model="codigo"
        :label="$t('cashRegister.fields.code') || 'Código'"
        variant="outlined"
        hide-details="auto"
        class="mb-4"
        required
      />

      <v-text-field
        v-model="nombre"
        :label="$t('cashRegister.fields.name') || 'Nombre'"
        variant="outlined"
        hide-details="auto"
        class="mb-4"
        required
      />

      <div class="d-flex align-center mb-2">
        <v-switch
          v-model="activo"
          :label="$t('cashRegister.fields.active') || 'Activo'"
          inset
        />
      </div>
    </template>

    <!-- actions -->
    <template #actions>
      <v-spacer />
      <v-btn
        variant="text"
        @click="handleClose"
      >
        {{ $t('general.cancel') }}
      </v-btn>
      <v-btn
        variant="text"
        color="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        {{ $t('cashRegister.create.submit') || 'CREAR CAJERO' }}
      </v-btn>
    </template>
  </BaseModal>
</template>
