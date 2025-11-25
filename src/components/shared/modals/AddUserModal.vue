<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import BaseModal from '@/components/shared/modals/BaseModal.vue';
  import type { VForm } from 'vuetify/components';
  import type { NewUserForm, NewUserPayload } from '@/domains/User';

  const open = defineModel<boolean>({ default: false });

  const emit = defineEmits<{
    (e: 'submit', user: NewUserPayload): void;
    (e: 'cancel'): void;
  }>();

  const formRef = ref<VForm | null>(null);
  const isValid = ref(false);
  const isSubmitting = ref(false);

  const form = reactive<NewUserForm>({
    usuarioNombre: '',
    nombre: '',
    password: '',
    confirmPassword: '',
  });

  // --- Validation rules ---
  type RuleFn = (value: string) => true | string;

  const required =
    (field: string): RuleFn =>
    (v) =>
      !!v || `${field} is required`;

  const minLength =
    (min: number): RuleFn =>
    (v) =>
      !v || v.length >= min || `Minimum ${min} characters`;

  const usernameRules: RuleFn[] = [required('Username'), minLength(3)];

  const nameRules: RuleFn[] = [required('Full name'), minLength(2)];

  const passwordRules: RuleFn[] = [required('Password'), minLength(8)];

  const confirmPasswordRules: RuleFn[] = [
    required('Confirm password'),
    (v) => v === form.password || 'Passwords do not match',
  ];

  // --- Helpers ---
  const resetForm = () => {
    form.usuarioNombre = '';
    form.nombre = '';
    form.password = '';
    form.confirmPassword = '';
    isValid.value = false;
    formRef.value?.resetValidation();
  };

  // Reset form whenever modal closes
  watch(open, (value) => {
    if (!value) {
      resetForm();
    }
  });

  // --- Actions ---
  const onSubmit = async () => {
    if (isSubmitting.value) return;

    const formInstance = formRef.value;

    if (!formInstance) return;

    const { valid } = await formInstance.validate();

    if (!valid) return;

    isSubmitting.value = true;

    try {
      const payload: NewUserPayload = {
        usuarioNombre: form.usuarioNombre.trim(),
        nombre: form.nombre.trim(),
        password: form.password,
        activo: true,
      };

      // Emit to parent – it should handle API call, error handling, etc.
      emit('submit', payload);

      // Close modal locally
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
    :title="$t('users.addUserModal.title')"
    :max-width="520"
    :persistent="true"
  >
    <template #default>
      <v-form
        ref="formRef"
        v-model="isValid"
        @submit.prevent="onSubmit"
      >
        <div class="d-flex flex-column ga-4">
          <v-text-field
            v-model="form.usuarioNombre"
            :label="$t('users.addUserModal.username')"
            autocomplete="off"
            :rules="usernameRules"
            variant="outlined"
            density="comfortable"
            required
          />

          <v-text-field
            v-model="form.nombre"
            :label="$t('users.addUserModal.name')"
            autocomplete="off"
            :rules="nameRules"
            variant="outlined"
            density="comfortable"
            required
            @input="
              form.nombre = form.nombre.replace(/\b\w/g, (char) =>
                char.toUpperCase(),
              )
            "
          />

          <v-text-field
            v-model="form.password"
            :label="$t('users.addUserModal.password')"
            type="password"
            autocomplete="new-password"
            :rules="passwordRules"
            variant="outlined"
            density="comfortable"
            required
          />

          <v-text-field
            v-model="form.confirmPassword"
            :label="$t('users.addUserModal.confirmPassword')"
            type="password"
            autocomplete="new-password"
            :rules="confirmPasswordRules"
            variant="outlined"
            density="comfortable"
            required
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
        {{ $t('general.cancel') }}
      </v-btn>

      <v-btn
        color="primary"
        type="submit"
        :loading="isSubmitting"
        :disabled="!isValid || isSubmitting"
        @click="onSubmit"
      >
        {{ $t('users.addUserModal.create') }}
      </v-btn>
    </template>
  </BaseModal>
</template>
